from enum import Enum
from datetime import datetime
from uuid import UUID
from typing import Optional

class UserStatus(Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"

class User:
    def __init__(
        self,
        user_id: UUID,
        name: str,
        email: str,
        password_hash: str,
        last_login: datetime,
        status: UserStatus
    ):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.last_login = last_login
        self.status = status