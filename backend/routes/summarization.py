# routes/summarization.py
from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from typing import Optional
import sys
import os
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))

from services.gemini import summarize_text, summarize_file
from routes.auth import verify_jwt_token

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