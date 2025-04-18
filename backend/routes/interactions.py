from fastapi import APIRouter, HTTPException, Depends, Form, File, UploadFile
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid
import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))

from services.connect_db import supabase
from services.embeddings import get_embeddings
from services.llm import generate_summary
from routes.auth import verify_jwt_token

interactions_router = APIRouter()

class Log(BaseModel):
    log_id: str
    relationship_id: str
    content: str
    date: datetime
    embeddings: List[float]

@interactions_router.post(
    "/relations/{relation_id}/interactions",
    response_model=Log
)
async def create_interaction(
    relation_id: str,
    text: str = Form(...),
    images: List[UploadFile] = File(default=[]),
    token: dict = Depends(verify_jwt_token)
):
    user_id = token["user_id"]

    # Verify ownership
    rel_resp = (
        supabase
        .from_("relationships")
        .select("relationship_id")
        .eq("relationship_id", relation_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not rel_resp.data:
        raise HTTPException(status_code=403, detail="Not authorized")

    # (Optional) upload images and collect URLs
    image_urls = []
    for img in images:
        key = f"interactions/{uuid.uuid4()}_{img.filename}"
        supabase.storage.from_("images").upload(key, img.file)
        url = supabase.storage.from_("images").get_public_url(key).public_url
        image_urls.append(url)

    # Generate AI summary
    summary = generate_summary(text, image_urls)

    # Compute embeddings for original text
    embeddings = get_embeddings(text)

    # Prepare record
    log_id = str(uuid.uuid4())
    record = {
        "log_id": log_id,
        "relationship_id": relation_id,
        "content": summary,
        "date": datetime.utcnow().isoformat(),
        "embeddings": embeddings
    }

    # Insert into logs
    insert_resp = supabase.from_("logs").insert(record).execute()
    if insert_resp.error:
        raise HTTPException(status_code=500, detail="Failed to create interaction")

    return Log(**record)


@interactions_router.patch(
    "/interactions/{interaction_id}",
    response_model=Log
)
async def update_interaction(
    interaction_id: str,
    interaction: Log,
    token: dict = Depends(verify_jwt_token)
):
    try:
        user_id = token["user_id"]

        # Verify relationship ownership
        rel_check = (
            supabase
            .from_("relationships")
            .select("relationship_id")
            .eq("user_id", user_id)
            .eq("relationship_id", interaction.relationship_id)
            .single()
            .execute()
        )
        if not rel_check.data:
            raise HTTPException(status_code=403, detail="Unauthorized")

        # Prepare update payload
        update_data = {
            "content": interaction.content,
            "embeddings": get_embeddings(interaction.content),
            "date": interaction.date.isoformat()
        }

        upd = (
            supabase
            .from_("logs")
            .update(update_data)
            .eq("log_id", interaction_id)
            .execute()
        )
        if upd.error or not upd.data:
            raise HTTPException(status_code=500, detail="Failed to update interaction")

        return Log(**upd.data[0])
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating interaction: {e}")
        raise HTTPException(status_code=500, detail="Internal error")


@interactions_router.delete("/interactions/{interaction_id}")
async def delete_interaction(
    interaction_id: str,
    token: dict = Depends(verify_jwt_token)
):
    try:
        user_id = token["user_id"]

        # Fetch relationship_id for this log
        log_resp = (
            supabase
            .from_("logs")
            .select("relationship_id")
            .eq("log_id", interaction_id)
            .single()
            .execute()
        )
        if not log_resp.data:
            raise HTTPException(status_code=404, detail="Interaction not found")

        # Verify ownership
        rel_resp = (
            supabase
            .from_("relationships")
            .select("relationship_id")
            .eq("user_id", user_id)
            .eq("relationship_id", log_resp.data["relationship_id"])
            .single()
            .execute()
        )
        if not rel_resp.data:
            raise HTTPException(status_code=403, detail="Unauthorized")

        # Delete
        del_resp = (
            supabase
            .from_("logs")
            .delete()
            .eq("log_id", interaction_id)
            .execute()
        )
        if del_resp.error:
            raise HTTPException(status_code=500, detail="Failed to delete interaction")

        return {"message": "Deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting interaction: {e}")
        raise HTTPException(status_code=500, detail="Internal error")
