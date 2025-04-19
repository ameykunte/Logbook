from datetime import datetime
from uuid import UUID

class Log:
    def __init__(
        self,
        log_id: UUID,
        relationship_id: UUID,
        content: str,
        is_pinned: bool,
        date: datetime
    ):
        self.log_id = log_id
        self.relationship_id = relationship_id
        self.content = content
        self.is_pinned = is_pinned
        self.date = date