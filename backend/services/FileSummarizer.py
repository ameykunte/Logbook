from abc import ABC, abstractmethod

class FileSummarizer(ABC):
    @abstractmethod
    async def summarize(self, file_path: str) -> str:
        """
        Summarize the content of the file at the given path.
        """
        pass