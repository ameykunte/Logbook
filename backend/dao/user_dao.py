from uuid import UUID
from models.User import User
from services.connect_db import supabase

class UserDAO:
    def __init__(self, database):
        self.database = supabase

    def get_user_by_id(self, user_id: UUID):
        """
        Retrieve a user by their ID.
        """
        return self.database.get_user_by_id(user_id)

    def get_user_by_email(self, email: str):
        """
        Retrieve a user by their email.
        """
        return self.database.get_user_by_email(email)

    def create_user(self, user: User):
        """
        Create a new user.
        """
        self.database.create_user(user)

    def update_user(self, user: User):
        """
        Update an existing user.
        """
        self.database.update_user(user)

    def delete_user(self, user_id: UUID):
        """
        Delete a user by their ID.
        """
        self.database.delete_user(user_id)