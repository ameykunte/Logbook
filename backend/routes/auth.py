from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from dao.user_dao import UserDAO
from services.google_calendar import GoogleCalendarService
from models.User import User, UserStatus
from uuid import uuid4
import json
from core.limiter import limiter
from starlette.requests import Request


JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is not set")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = 3600

auth_router = APIRouter()
user_dao = UserDAO()  # Initialize UserDAO

# Request models
class LoginRequest(BaseModel):
    email: str
    password: str

class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str

def create_jwt_token(user_id: str, email: str):
    """
    Create a JWT token with user information and expiration
    """
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

@auth_router.post("/login")
async def login(request: Request, login_data: LoginRequest):
    # Apply rate limiting to the request
    @limiter.limit("5/minute")
    def rate_limit_login(request: Request):
        return True
    
    # Check the rate limit
    rate_limit_login(request)
    try:
        user = user_dao.get_user_by_email(login_data.email)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not bcrypt.checkpw(login_data.password.encode(), user.password_hash.encode()):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user_dao.update_user_last_login(user.user_id)
        
        access_token = create_jwt_token(str(user.user_id), user.email)
        
        # Add Google Calendar auth URL
        calendar_service = GoogleCalendarService()
        google_auth_url = calendar_service.get_auth_url(str(user.user_id))
        
        return {
            "message": "Login successful", 
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user.user_id),
            "user_name": user.name,
            "google_auth_url": google_auth_url
        }
    
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@auth_router.post("/signup")
async def signup(request: Request, signup_data: SignUpRequest):
    """
    Rate limited signup endpoint
    """
    # Apply rate limiting to the request
    @limiter.limit("5/minute")
    def rate_limit_signup(request: Request):
        return True
    
    # Check the rate limit
    rate_limit_signup(request)
    try:
        if user_dao.check_email_exists(signup_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = bcrypt.hashpw(signup_data.password.encode(), bcrypt.gensalt()).decode()
        
        new_user = {
            "name": signup_data.name,
            "email": signup_data.email,
            "password_hash": hashed_password,
            "last_login": datetime.now().isoformat(),
            "status": UserStatus.ACTIVE.value
        }
        
        created_user = user_dao.create_user(new_user)
        access_token = create_jwt_token(str(created_user.user_id), created_user.email)
        
        # Add Google Calendar auth URL
        calendar_service = GoogleCalendarService()
        google_auth_url = calendar_service.get_auth_url(str(created_user.user_id))
        
        return {
            "message": "User created successfully", 
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(created_user.user_id),
            "email": created_user.email,
            "google_auth_url": google_auth_url
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def verify_jwt_token(authorization: str = Header(..., alias="Authorization")):
    """
    Verify the JWT token from the Authorization header.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    token = authorization.split(" ")[1]  # Extract the token after "Bearer"
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
async def get_google_credentials(
    google_credentials: str = Header(..., alias="Google-Credentials")
) -> dict:
    try:
        return json.loads(google_credentials)
    except:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google credentials"
        )