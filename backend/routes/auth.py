from fastapi import APIRouter, HTTPException, Request, Depends, Header
from pydantic import BaseModel
import datetime
import bcrypt
import jwt
from datetime import datetime, timedelta

import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from services.connect_db import supabase


JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is not set")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = 3600

auth_router = APIRouter()

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
async def login(request: LoginRequest):
    try:
        response = supabase.table("users").select("*").eq("email", request.email).execute()
        
        if not response.data:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = response.data[0]
        
        if not bcrypt.checkpw(request.password.encode(), user["password_hash"].encode()):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        supabase.table("users").update({"last_login": datetime.now().isoformat()}).eq("user_id", user["user_id"]).execute()
        
        access_token = create_jwt_token(user["user_id"], user["email"])
        
        return {
            "message": "Login successful", 
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user["user_id"],
            "user_name": user["name"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@auth_router.post("/signup")
async def signup(request: SignUpRequest):
    try:
        email_check = supabase.table("users").select("email").eq("email", request.email).execute()
        
        if email_check.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = bcrypt.hashpw(request.password.encode(), bcrypt.gensalt()).decode()
        
        new_user = {
            "name": request.name,
            "email": request.email,
            "password_hash": hashed_password,
            "last_login": datetime.now().isoformat(),
            "status": "ACTIVE"
        }
        
        response = supabase.table("users").insert(new_user).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        user_data = response.data[0]
        access_token = create_jwt_token(user_data["user_id"], user_data["email"])
        
        return {
            "message": "User created successfully", 
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user_data["user_id"],
            "email": user_data["email"]
        }
    
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=400, detail=str(e))

def verify_jwt_token(authorization: str = Header(...)):
    """
    Verify the JWT token from the Authorization header.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    token = authorization.split(" ")[1]  # Extract the token after "Bearer"
    print("Verifying token:", token, flush=True)  # Debug statement
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        print("Token payload:", payload, flush=True)  # Debug statement
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")