from datetime import datetime
from uuid import UUID

class Event:
    def __init__(
        self,
        event_id: UUID,
        user_id: UUID,
        relationship_id: UUID,
        log_id: UUID,
        title: str,
        description: str,
        start_time: datetime,
        end_time: datetime,
        location: str
    ):
        self.event_id = event_id
        self.user_id = user_id
        self.relationship_id = relationship_id
        self.log_id = log_id
        self.title = title
        self.description = description
        self.start_time = start_time
        self.end_time = end_time
        self.location = location