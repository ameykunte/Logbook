import os
from fastapi import HTTPException
from dotenv import load_dotenv
from services.FileSummarizer import FileSummarizer
load_dotenv()
from typing import Optional
import google.generativeai as genai

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

async def summarize_text(text: str) -> str:
    """
    Use Gemini to summarize text content
    """
    if not text or len(text.strip()) == 0:
        return ""
    
    try:
        prompt = f"""
        Please provide a concise summary of the following text. Focus on key points, 
        main ideas, and important details while maintaining the original meaning:
        
        {text}
        """
        
        response = model.generate_content(prompt)
        summary = response.text
        
        # Return a default message if summary is empty
        if not summary or len(summary.strip()) == 0:
            return "No meaningful summary could be generated."
        
        return summary
    
    except Exception as e:
        print(f"Error summarizing text with Gemini: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to summarize text: {str(e)}")
