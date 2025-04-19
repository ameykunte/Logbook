from datetime import datetime
from uuid import UUID

class Relationship:
    def __init__(
        self,
        relationship_id: UUID,
        category_type: str,
        user_id: UUID,
        name: str,
        email_address: str,
        phone_number: str,
        last_interaction_date: datetime
    ):
        self.relationship_id = relationship_id
        self.category_type = category_type
        self.user_id = user_id
        self.name = name
        self.email_address = email_address
        self.phone_number = phone_number
        self.last_interaction_date = last_interaction_date