from PIL import Image
import pytesseract
from services.SummarizeText import summarize_text
from fastapi import HTTPException
from services.FileSummarizer import FileSummarizer
class ImageFileSummarizer(FileSummarizer):
    async def summarize(self, file_path: str) -> str:
        try:
            image = Image.open(file_path)
            text_content = pytesseract.image_to_string(image)
            
            if not text_content.strip():
                return "The image contains no recognizable text."
            
            return await summarize_text(text_content)
        except Exception as e:
            print(f"Error summarizing image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to summarize image: {str(e)}")