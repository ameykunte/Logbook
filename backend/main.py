from fastapi.middleware.cors import CORSMiddleware
from routes.relationship import relationship_router
from routes.interactions import interactions_router
from routes.summarization import summarization_router
from routes.search import search_router
from routes.auth import auth_router
from routes.calendar import calendar_router
from fastapi import FastAPI, Request, Depends
from dotenv import load_dotenv
import os
import sys
from contextlib import asynccontextmanager
# Use the default handler or create a custom one if needed
from slowapi.middleware import SlowAPIMiddleware 
from dotenv import load_dotenv

# from routes.search import search_router

# --- Lifespan Management (Optional but good practice) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    print("API starting up...")
    # Initialize database connections, models, etc. here if needed
    yield
    # --- Shutdown ---
    print("API shutting down...")
    # Cleanup resources here if needed

# --- FastAPI App Initialization ---
app = FastAPI(lifespan=lifespan)

# --- Rate Limiter Setup ---
# Add the SlowAPIMiddleware - this automatically handles adding state and the exception handler
app.add_middleware(SlowAPIMiddleware)

load_dotenv()
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get('REACT_FRONTEND_URL'), # Adjust this for production
                   "http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(relationship_router, prefix="/relations")
app.include_router(auth_router, prefix="/auth")
app.include_router(interactions_router, prefix="/interactions")
app.include_router(calendar_router, prefix="/api/calendar")
app.include_router(summarization_router, prefix="/summarize", tags=["summarization"])
app.include_router(search_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
