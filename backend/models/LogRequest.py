from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import List, Optional

class LogRequest(BaseModel):
    relationship_id: Optional[str] = None
    content: str
    date: datetime