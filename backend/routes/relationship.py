from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import numpy as np
from pytz import timezone

import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
# from services.connect_db import supabase
from services.embeddings import get_embeddings

from dao.relationship_dao import RelationshipDAO
from dao.log_dao import LogDAO
from routes.auth import verify_jwt_token

relationship_router = APIRouter()

# Pydantic model for a relationship
class Relationship(BaseModel):
    relationship_id: Optional[str] = None
    user_id: str
    category_type: str
    name: str
    location: Optional[str] = None
    email_address: Optional[str] = None
    phone_number: Optional[str] = None
    last_interaction_date: Optional[datetime] = None

class RelationshipRequest(BaseModel):
    category_type: str
    name: str
    location: Optional[str] = None
    email_address: Optional[str] = None
    phone_number: Optional[str] = None

class Log(BaseModel):
    log_id: Optional[str] = None
    relationship_id: str
    content: str
    date: datetime
    fts: Optional[str] = None  # For tsvector
    embeddings: List[float] = Field(
        ...,  # Make it required
        description="384-dimensional vector for semantic search"
    )

    @validator('embeddings', pre=True)
    def parse_embeddings(cls, v):
        if isinstance(v, str):
            # Remove brackets and split by comma
            cleaned = v.strip('[]')
            return [float(x) for x in cleaned.split(',')]
        return v

    class Config:
        json_encoders = {
            np.float32: lambda x: float(x),
            np.float64: lambda x: float(x)
        }

class LogRequest(BaseModel):
    relationship_id: Optional[str] = None
    content: str
    date: datetime

# Get all relationships for a user
@relationship_router.get("/", response_model=List[Relationship])
async def get_all_relationships(token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]
        relationshipDao = RelationshipDAO()
        response = relationshipDao.get_by_user_id(user_id)
        # response = relationDao.get_by_user_id(user_id)
        # print("yo hu ho he")
        # response = supabase.table("relationships").select("*").eq("user_id", user_id).execute()
        if not response.data:
            return []
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch relationships")

# Get a single relationship by ID
@relationship_router.get("/{relationship_id}", response_model=Relationship)
async def get_relationship(relationship_id: str, token: str = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]
        relationDao = RelationshipDAO() 
        response = relationDao.get_by_id(relationship_id, user_id)
        # response = supabase.table("relationships").select("*").eq("relationship_id", relationship_id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Relationship not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch relationship")

# Add a new relationship
@relationship_router.post("/add", response_model=Relationship)
async def add_relationship(relationship: RelationshipRequest, token: dict = Depends(verify_jwt_token)):
    """
    Add a new relationship for the authenticated user.
    """
    try:
        user_id = token["user_id"]  # Extract user_id from the token payload
        new_relationship = relationship.dict()
        new_relationship["user_id"] = user_id
        relationshipDao = RelationshipDAO()
        create_response = relationshipDao.create(new_relationship)
        print("Supabase response:", create_response, flush=True)  # Debug statement
        return  create_response.data[0]
    except Exception as e:
        print("Error in add_relationship:", e, flush=True)  # Debug statement
        raise HTTPException(status_code=500, detail="Failed to add relationship")

# Update an existing relationship
@relationship_router.put("/{relationship_id}", response_model=Relationship)
async def update_relationship(relationship_id: str, relationship: RelationshipRequest, token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]
        update_relationship = relationship.dict()
        relationDao = RelationshipDAO()
        updated_response = relationDao.update(update_relationship, relationship_id, user_id)
        # response = supabase.table("relationships").update(update_relationship).eq("relationship_id", relationship_id).eq("user_id", user_id).execute()
        if not updated_response.data:
            raise HTTPException(status_code=404, detail="Relationship not found or not authorized")
        return updated_response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update relationship")

# Delete a relationship
@relationship_router.delete("/{relationship_id}")
async def delete_relationship(relationship_id: str, token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]
        relationshipDao = RelationshipDAO()
        deleted_response = relationshipDao.delete(relationship_id, user_id)
        # response = supabase.table("relationships").delete().eq("relationship_id", relationship_id).eq("user_id", user_id).execute()
        if not deleted_response.data:
            raise HTTPException(status_code=404, detail="Relationship not found or not authorized")
        return {"message": "Relationship deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete relationship")
    
@relationship_router.get("/{relationship_id}/interactions")
async def list_interactions(relationship_id: str, token: dict = Depends(verify_jwt_token)):
    try:
        print("[DEBUG] Received request to list interactions for relationship_id")
        user_id = token["user_id"]
        try: 
            # Check if the relationship exists and belongs to the user
            relationshipDao = RelationshipDAO()
            relationship_response = relationshipDao.get_by_id(relationship_id, user_id)
            # relationship_response = supabase.table("relationships").select("*").eq("relationship_id", relationship_id).eq("user_id", user_id).execute()
            if not relationship_response.data:
                raise HTTPException(status_code=404, detail="Relationship not found or not authorized")
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to fetch relationship")
        
        # Fetch interactions for the relationship
        # response = supabase.table("logs").select("*").eq("relationship_id", relationship_id).execute()
        logDao = LogDAO()
        response = logDao.get_by_relationship_id(relationship_id)

        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch interactions")

@relationship_router.post("/{relationship_id}/interactions", response_model=Log)
async def post_interaction(relationship_id: str, log_request: LogRequest, token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]

        # Check if the relationship exists and belongs to the user
        relationshipDao = RelationshipDAO()
        relationship_response = relationshipDao.get_by_id(relationship_id, user_id)
        if not relationship_response.data:
            raise HTTPException(status_code=404, detail="Relationship not found or not authorized")

        # Convert the date to IST timezone
        ist = timezone("Asia/Kolkata")
        if isinstance(log_request.date, datetime):
            date_in_ist = log_request.date.astimezone(ist)
        else:
            # If the date is a string, parse it and convert to IST
            date_in_ist = datetime.fromisoformat(log_request.date).astimezone(ist)

        # Get embeddings first
        embeddings = get_embeddings(log_request.content)
        
        # Create the new log entry
        new_log = {
            "content": log_request.content,
            "date": date_in_ist.isoformat(),  # Ensure the date is in ISO format with IST timezone
            "relationship_id": relationship_id,
            "embeddings": embeddings,
            # fts will be handled by Supabase trigger/function
        }

        # Insert the log into the "logs" table
        logDao = LogDAO()
        response = logDao.create(new_log)
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to add interaction")

        return Log(**response.data[0])

    except Exception as e:
        print("Error in post_interaction:", str(e), flush=True)
        raise HTTPException(status_code=500, detail=f"Failed to add interaction: {str(e)}")