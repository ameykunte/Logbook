from fastapi.middleware.cors import CORSMiddleware
from routes.api import api_router
from routes.relationship import relationship_router
from routes.auth import auth_router
from fastapi import FastAPI, Request, Depends
import os
from routes.search import search_router

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api")
app.include_router(relationship_router, prefix="/relationship")
app.include_router(auth_router, prefix="/auth")
app.include_router(search_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)