from fastapi import APIRouter

relationship_router = APIRouter()

@relationship_router.get("/")
async def get_relationship():
    return {"message": "Relationship data"}