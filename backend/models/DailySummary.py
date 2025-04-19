from datetime import datetime
from uuid import UUID

class DailySummary:
    def __init__(
        self,
        summary_id: UUID,
        user_id: UUID,
        summary_date: datetime,
        summary_content: str,
        created_at: datetime
    ):
        self.summary_id = summary_id
        self.user_id = user_id
        self.summary_date = summary_date
        self.summary_content = summary_content
        self.created_at = created_at