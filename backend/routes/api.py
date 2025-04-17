from fastapi import APIRouter

api_router = APIRouter()

@api_router.get("/hello")
async def hello():
    return {"message": "Hello Sudhann!!!"}