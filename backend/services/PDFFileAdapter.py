from PyPDF2 import PdfReader
from services.SummarizeText import summarize_text
from fastapi import HTTPException
from services.FileSummarizer import FileSummarizer
class PDFFileSummarizer(FileSummarizer):
    async def summarize(self, file_path: str) -> str:
        try:
            reader = PdfReader(file_path)
            text_content = ""
            for page in reader.pages:
                text_content += page.extract_text() or ""
            
            if not text_content.strip():
                return "The PDF contains no extractable text."
            
            return await summarize_text(text_content)
        except Exception as e:
            print(f"Error summarizing PDF: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to summarize PDF: {str(e)}")