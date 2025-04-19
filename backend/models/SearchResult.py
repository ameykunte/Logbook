from datetime import datetime
from uuid import UUID
from typing import List

class SearchResult:
    def __init__(
        self,
        id: UUID,
        user_id: UUID,
        query: str,
        log_ids: List[UUID],
        ai_summary: str,
        search_date: datetime
    ):
        self.id = id
        self.user_id = user_id
        self.query = query
        self.log_ids = log_ids
        self.ai_summary = ai_summary
        self.search_date = search_date