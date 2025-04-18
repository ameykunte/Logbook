from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from services.connect_db import supabase

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

# Get all relationships for a user
@relationship_router.get("/", response_model=List[Relationship])
async def get_all_relationships(token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]
        response = supabase.table("relationships").select("*").eq("user_id", user_id).execute()
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
        response = supabase.table("relationships").select("*").eq("relationship_id", relationship_id).eq("user_id", user_id).execute()
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
        response = supabase.table("relationships").insert(new_relationship).execute()
        print("Supabase response:", response, flush=True)  # Debug statement
        return response.data[0]
    except Exception as e:
        print("Error in add_relationship:", e, flush=True)  # Debug statement
        raise HTTPException(status_code=500, detail="Failed to add relationship")

# Update an existing relationship
@relationship_router.put("/{relationship_id}", response_model=Relationship)
async def update_relationship(relationship_id: str, updated_relationship: Relationship, token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]
        response = supabase.table("relationships").update(updated_relationship.dict()).eq("relationship_id", relationship_id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Relationship not found or not authorized")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update relationship")

# Delete a relationship
@relationship_router.delete("/{relationship_id}")
async def delete_relationship(relationship_id: str, token: dict = Depends(verify_jwt_token)):
    try:
        user_id = token["user_id"]
        response = supabase.table("relationships").delete().eq("relationship_id", relationship_id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Relationship not found or not authorized")
        return {"message": "Relationship deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete relationship")
