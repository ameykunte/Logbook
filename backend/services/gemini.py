import os
import tempfile
from typing import Optional
from fastapi import HTTPException
import google.generativeai as genai
from services.FileSummarizerFactory import FileSummarizerFactory    

# Initialize Gemini API with your API key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')


async def summarize_file(file_content: bytes, file_name: Optional[str] = None) -> str:
    """
    Use Gemini to summarize file content
    Supports text files, PDFs, and images (via OCR)
    """
    if not file_content:
        return ""
    
    try:
        # Create a temporary file to store the content
        with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file_name}" if file_name else "") as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        # Get the appropriate summarizer using the factory
        summarizer = FileSummarizerFactory.get_summarizer(file_name)
        return await summarizer.summarize(temp_file_path)
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

async def summarize_daily_interactions(interactions):
    """
    Summarize a list of interactions from today using Gemini
    """
    try:
        if not interactions:
            return "No interactions recorded today."
        
        # Format interactions with relation names
        formatted_interactions = []
        for interaction in interactions:
            relation_name = interaction.relationName
            relation_category = interaction.relationCategory if hasattr(interaction, "relationCategory") else ""
            content = interaction.content
            date = interaction.date
            
            formatted_text = f"Interaction with {relation_name} ({relation_category}) on {date}:\n{content}\n\n"
            formatted_interactions.append(formatted_text)
        
        # Join all interactions into one text
        all_interactions_text = "\n".join(formatted_interactions)
        
        # Prepare prompt for Gemini
        prompt = f"""
        Please provide a concise daily summary of the following interactions. 
        Group insights by relationship and highlight key points, action items, and follow-ups needed:
        
        {all_interactions_text}
        """
        
        # Call Gemini API to generate summary
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = await model.generate_content_async(prompt)
        summary = response.text
        
        return summary
    except Exception as e:
        print(f"Error in summarize_daily_interactions: {str(e)}")
        raise