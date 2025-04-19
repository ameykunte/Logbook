from typing import Optional
from services.FileSummarizer import FileSummarizer
from services.PDFFileAdapter import PDFFileSummarizer 
from services.ImageFileAdapter import ImageFileSummarizer
from services.TextFileAdapter import TextFileSummarizer
class FileSummarizerFactory:
    @staticmethod
    def get_summarizer(file_name: Optional[str]) -> FileSummarizer:
        if file_name and file_name.lower().endswith('.pdf'):
            return PDFFileSummarizer()
        elif file_name and file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
            return ImageFileSummarizer()
        else:
            return TextFileSummarizer()