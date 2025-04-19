from typing import Optional
from models.User import User, UserStatus
import os
from dotenv import load_dotenv
import sys
from datetime import datetime
from fastapi import HTTPException

load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from services.connect_db import supabase

class UserDAO:
    def __init__(self):
        self.database = supabase

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """
        Retrieve a user by their ID.
        """
        response = self.database.table("users").select("*").eq("user_id", str(user_id)).execute()
        if response.data:
            user_data = response.data[0]
            return User(
                user_id=user_data["user_id"],
                name=user_data["name"],
                email=user_data["email"],
                password_hash=user_data["password_hash"],
                last_login=datetime.fromisoformat(user_data["last_login"]),
                status=UserStatus(user_data["status"])
            )
        return None

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by their email.
        """
        response = self.database.table("users").select("*").eq("email", email).execute()
        if response.data:
            user_data = response.data[0]
            return User(
                user_id=user_data["user_id"],
                name=user_data["name"],
                email=user_data["email"],
                password_hash=user_data["password_hash"],
                last_login=datetime.fromisoformat(user_data["last_login"]),
                status=UserStatus(user_data["status"])
            )
        return None

    def create_user(self, user: dict) -> User:
        """
        Create a new user.
        """
        response = self.database.table("users").insert(user).execute()
        if response.data:
            created_user = response.data[0]
            return User(
                user_id=created_user["user_id"],
                name=created_user["name"],
                email=created_user["email"],
                password_hash=created_user["password_hash"],
                last_login=datetime.fromisoformat(created_user["last_login"]),
                status=UserStatus(created_user["status"])
            )
        raise HTTPException(status_code=400, detail="Failed to create user")

    def update_user_last_login(self, user_id: str) -> None:
        """
        Update the last login timestamp for a user.
        """
        self.database.table("users").update({"last_login": datetime.now().isoformat()}).eq("user_id", user_id).execute()

    def check_email_exists(self, email: str) -> bool:
        """
        Check if an email is already registered.
        """
        response = self.database.table("users").select("email").eq("email", email).execute()
        return bool(response.data)