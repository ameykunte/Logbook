# filepath: /Users/vamseedharvanarasi/vamsee_IIITH/Three_2/SE/Projects/Project-3/backend/app_config.py
from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)