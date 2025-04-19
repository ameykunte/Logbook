import os
import tempfile
from typing import Optional
from fastapi import HTTPException
import google.generativeai as genai
from PIL import Image
from PyPDF2 import PdfReader
import pytesseract

# Initialize Gemini API with your API key
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
        
        # Determine file type and process accordingly
        if file_name and file_name.lower().endswith('.pdf'):
            # Handle PDF files
            try:
                reader = PdfReader(temp_file_path)
                text_content = ""
                for page in reader.pages:
                    text_content += page.extract_text() or ""
                
                if not text_content.strip():
                    return "The PDF contains no extractable text."
                
                return await summarize_text(text_content)
            except Exception as e:
                print(f"Error summarizing PDF: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to summarize PDF: {str(e)}")
        
        elif file_name and file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
            print(f"[DEBUG] Summarizing image file: {file_name}")
            # Handle image files
            try:
                image = Image.open(temp_file_path)
                text_content = pytesseract.image_to_string(image)
                
                if not text_content.strip():
                    return "The image contains no recognizable text."
                
                return await summarize_text(text_content)
            except Exception as e:
                print(f"Error summarizing image: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to summarize image: {str(e)}")
        
        else:
            # Assume it's a text file
            try:
                with open(temp_file_path, 'r', encoding='utf-8') as f:
                    text_content = f.read()
                return await summarize_text(text_content)
            except UnicodeDecodeError:
                return f"Summary of file {file_name or 'uploaded document'}: This appears to be a non-text file which cannot be directly summarized."
        
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
# Add this function to gemini.py

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