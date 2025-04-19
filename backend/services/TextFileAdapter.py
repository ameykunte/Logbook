from abc import ABC, abstractmethod
from services.SummarizeText import summarize_text
from fastapi import HTTPException
import os
from typing import Optional
from dotenv import load_dotenv
load_dotenv()
from services.FileSummarizer import FileSummarizer
class TextFileSummarizer(FileSummarizer):
    async def summarize(self, file_path: str) -> str:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text_content = f.read()
            return await summarize_text(text_content)
        except UnicodeDecodeError:
            return "This appears to be a non-text file which cannot be directly summarized."