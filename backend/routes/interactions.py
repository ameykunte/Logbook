from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from services.connect_db import supabase
from services.embeddings import get_embeddings
from routes.auth import verify_jwt_token

interactions_router = APIRouter()

class Log(BaseModel):
    log_id: Optional[str] = None
    relationship_id: Optional[str] = None
    content: str
    date: datetime
    embeddings: Optional[List[float]] = None

@interactions_router.patch("/{interaction_id}", response_model=Log)
async def update_interactions(interaction_id: str, interaction: Log, token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]

        # Step 1: Check if the relationship_id belongs to the user
        relationship_response = (
            supabase
            .from_("relationships")
            .select("relationship_id")
            .eq("user_id", user_id)
            .eq("relationship_id", interaction.relationship_id)
            .single()
            .execute()
        )

        if not relationship_response.data:
            raise HTTPException(status_code=403, detail="Unauthorized: Relationship does not belong to user")
        
        # Prepare update data
        update_data = {
            "content": interaction.content
        }
        
        update_data["embeddings"] = get_embeddings(interaction.content)
        
        # Handle date conversion
        if interaction.date:
            update_data["date"] = interaction.date.isoformat()

        # Step 2: Update the log
        update_response = (
            supabase
            .from_("logs")
            .update(update_data)  # Remove the extra dictionary wrapping
            .eq("log_id", interaction_id)
            .execute()
        )

        if not update_response.data:
            raise HTTPException(status_code=500, detail="Failed to update log")

        return update_response.data[0]

    except Exception as e:
        print(f"Error updating interaction: {str(e)}")  # Add debug logging
        raise HTTPException(status_code=500, detail=f"Failed to update interaction: {str(e)}")
    
@interactions_router.delete("/{interaction_id}")
async def delete_interaction(interaction_id: str, token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]

        # First, get the interaction to check relationship_id
        interaction_response = (
            supabase
            .from_("logs")
            .select("relationship_id")
            .eq("log_id", interaction_id)
            .single()
            .execute()
        )

        if not interaction_response.data:
            raise HTTPException(status_code=404, detail="Interaction not found")

        # Check if the relationship belongs to the user
        relationship_response = (
            supabase
            .from_("relationships")
            .select("relationship_id")
            .eq("user_id", user_id)
            .eq("relationship_id", interaction_response.data["relationship_id"])
            .single()
            .execute()
        )

        if not relationship_response.data:
            raise HTTPException(status_code=403, detail="Unauthorized: Cannot delete this interaction")

        # Delete the interaction
        delete_response = (
            supabase
            .from_("logs")
            .delete()
            .eq("log_id", interaction_id)
            .execute()
        )

        if not delete_response.data:
            raise HTTPException(status_code=500, detail="Failed to delete interaction")

        return {"message": "Interaction deleted successfully"}

    except Exception as e:
        print(f"Error deleting interaction: {str(e)}")  # Debug logging
        raise HTTPException(status_code=500, detail=f"Failed to delete interaction: {str(e)}")