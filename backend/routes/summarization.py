# routes/summarization.py
from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from typing import List,Optional
import sys
import os
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))

from services.gemini import summarize_text, summarize_file, summarize_daily_interactions
from routes.auth import verify_jwt_token
from pydantic import BaseModel

summarization_router = APIRouter()

@summarization_router.post("/text")
async def summarize_text_endpoint(
    text: str = Form(...),
    token: dict = Depends(verify_jwt_token)
):
    """
    Endpoint to summarize text using Gemini API
    """
    try:
        summary = await summarize_text(text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@summarization_router.post("/file")
async def summarize_file_endpoint(
    file: UploadFile = File(...),
    token: dict = Depends(verify_jwt_token)
):
    """
    Endpoint to summarize a file using Gemini API
    """
    try:
        file_content = await file.read()
        summary = await summarize_file(file_content, file.filename)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File summarization failed: {str(e)}")




class InteractionModel(BaseModel):
    content: str
    date: str
    relationName: str
    relationCategory: Optional[str] = ""
    # Add other fields as needed

class InteractionsPayload(BaseModel):
    interactions: List[InteractionModel]

@summarization_router.post("/daily")
async def summarize_daily_interactions_endpoint(
    payload: InteractionsPayload,
    token: dict = Depends(verify_jwt_token)
):
    """
    Endpoint to summarize today's interactions using Gemini API
    """
    try:
        # Pass the interactions list to the Gemini service
        summary = await summarize_daily_interactions(payload.interactions)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Daily summarization failed: {str(e)}")