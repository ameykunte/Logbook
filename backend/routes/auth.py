from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth, credentials

# Initialize Firebase Admin SDK
cred = credentials.Certificate("../firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

auth_router = APIRouter()

# Request models
class LoginRequest(BaseModel):
    email: str
    password: str

class SignUpRequest(BaseModel):
    email: str
    password: str
    user_name: str

@auth_router.post("/login")
async def login(request: LoginRequest):
    try:
        user = auth.get_user_by_email(request.email)
        custom_token = auth.create_custom_token(user.uid)
        return {"message": "Login successful", "token": custom_token.decode("utf-8")}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@auth_router.post("/signup")
async def signup(request: SignUpRequest):
    try:
        user = auth.create_user(
            email=request.email,
            password=request.password,
            display_name=request.user_name,
        )
        return {"message": "User created successfully", "user_id": user.uid, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))