from typing import Optional
from uuid import UUID
from models.User import User

class UserDAO:
    def __init__(self, database):
        self.database = database

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """
        Retrieve a user by their ID.
        """
        return self.database.get_user_by_id(user_id)

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by their email.
        """
        return self.database.get_user_by_email(email)

    def create_user(self, user: User) -> None:
        """
        Create a new user.
        """
        self.database.create_user(user)

    def update_user(self, user: User) -> None:
        """
        Update an existing user.
        """
        self.database.update_user(user)

    def delete_user(self, user_id: UUID) -> None:
        """
        Delete a user by their ID.
        """
        self.database.delete_user(user_id)