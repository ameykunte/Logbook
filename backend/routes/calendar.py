from fastapi import APIRouter, HTTPException, Depends, Request, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from fastapi.responses import HTMLResponse
import json
import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from services.google_calendar import GoogleCalendar
from services.connect_db import supabase
from services.event_extractor import extract_events_from_interaction

from routes.auth import verify_jwt_token
from routes.auth import get_google_credentials
calendar_router = APIRouter()

# OAuth 2.0 scopes for Google Calendar API
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/calendar.events']

class CalendarEvent(BaseModel):
    summary: str
    description: Optional[str]
    start_time: datetime
    end_time: datetime
    location: Optional[str]
    attendees: Optional[List[str]]

def get_calendar_service():
    """Get an authorized Google Calendar API service instance."""
    try:
        credentials = Credentials.from_authorized_user_file('token.json', SCOPES)
        service = build('calendar', 'v3', credentials=credentials)
        return service
    except Exception as e:
        flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
        credentials = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())
        service = build('calendar', 'v3', credentials=credentials)
        return service

@calendar_router.get("/events")
async def list_events(token: dict = Depends(verify_jwt_token)):
    """List upcoming calendar events."""
    try:
        service = get_calendar_service()
        now = datetime.utcnow().isoformat() + 'Z'
        events_result = service.events().list(
            calendarId='primary',
            timeMin=now,
            maxResults=10,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        events = events_result.get('items', [])
        return events
    except HttpError as error:
        raise HTTPException(status_code=500, detail=f"Calendar API error: {str(error)}")

@calendar_router.post("/events")
async def create_event(
    event: CalendarEvent, 
    google_credentials: dict = Depends(get_google_credentials),
    token: dict = Depends(verify_jwt_token)
):
    try:
        google_calendar = GoogleCalendar()
        event_body = {
            'summary': event.summary,
            'description': event.description,
            'start': {
                'dateTime': event.start_time.isoformat(),
                'timeZone': 'IST',
            },
            'end': {
                'dateTime': event.end_time.isoformat(),
                'timeZone': 'IST',
            }
        }
        return google_calendar.create_event(google_credentials, event_body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@calendar_router.delete("/events/{event_id}")
async def delete_event(event_id: str, token: dict = Depends(verify_jwt_token)):
    """Delete a calendar event."""
    try:
        service = get_calendar_service()
        service.events().delete(
            calendarId='primary',
            eventId=event_id
        ).execute()
        return {"message": "Event deleted successfully"}
    except HttpError as error:
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(error)}")

@calendar_router.get("/auth-url")
async def get_google_auth_url(token: dict = Depends(verify_jwt_token)):
    try:
        google_calendar = GoogleCalendar()
        auth_url = google_calendar.get_auth_url(token["user_id"])
        return {"auth_url": auth_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@calendar_router.get("/oauth-callback")
async def google_oauth_callback(
    code: str,
    state: str,
    request: Request
):
    try:
        google_calendar = GoogleCalendar()
        credentials = google_calendar.get_credentials_from_code(code, state)
        html_content = f"""
            <html>
                <body>
                    <script>
                        const message = {{
                            type: 'GOOGLE_AUTH',
                            code: '{code}',
                            state: '{state}',
                            credentials: {json.dumps(credentials)}
                        }};
                        if (window.opener) {{
                            window.opener.postMessage(message, '*');
                            setTimeout(() => window.close(), 1000);
                        }}
                    </script>
                    <p>Authentication successful! You can close this window.</p>
                </body>
            </html>
        """
        return HTMLResponse(content=html_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@calendar_router.post("/extract-events")
async def extract_events(
    request: Request,
    google_credentials: dict = Depends(get_google_credentials),
    token: dict = Depends(verify_jwt_token)
) -> Dict[str, List[Any]]:
    """Extract potential events from interaction text"""
    try:
        body = await request.json()
        interaction_text = body.get("interaction_text")
        relationship_id = body.get("relationship_id")
        interaction_date = body.get("interaction_date")
        
        print(f"[DEBUG] Raw interaction date received: {interaction_date}")
        print(f"[DEBUG] Date type: {type(interaction_date)}")
        
        # Try to parse the date if it's a string
        if isinstance(interaction_date, str):
            try:
                parsed_date = datetime.fromisoformat(interaction_date.replace('Z', ''))
                print(f"[DEBUG] Parsed interaction date: {parsed_date}")
            except ValueError as e:
                print(f"[DEBUG] Date parsing error: {e}")
        
        if not interaction_text:
            raise HTTPException(status_code=400, detail="interaction_text is required")
        if not relationship_id:
            raise HTTPException(status_code=400, detail="relationship_id is required")
            
        print(f"[DEBUG] Received text for extraction: {interaction_text}")
        print(f"[DEBUG] Relation ID: {relationship_id}")
        print(f"[DEBUG] Interaction date: {interaction_date}")
        
        # Get relation information from database
        relation_response = supabase.table("relationships").select("*").eq("relationship_id", relationship_id).single().execute()
        if not relation_response.data:
            raise HTTPException(status_code=404, detail="Relation not found")
        
        relation_info = {
            "name": relation_response.data.get("name"),
            "email": relation_response.data.get("email_address"),
            "company": relation_response.data.get("category_type"),
            "interaction_date": interaction_date
        }
        
        print(f"[DEBUG] Relation info with date: {relation_info}")
        
        events = await extract_events_from_interaction(interaction_text, relation_info)
        print(f"[DEBUG] Extracted events: {events}")
        
        if not events:
            return {"events": []}
            
        return {"events": [event.dict() for event in events]}
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    except Exception as e:
        print(f"[DEBUG] Error in extract_events: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@calendar_router.post("/add-extracted-event")
async def add_extracted_event(
    event: dict = Body(...),
    google_credentials: dict = Depends(get_google_credentials),
    token: dict = Depends(verify_jwt_token)
):
    """Add an extracted event to Google Calendar"""
    try:
        print(f"[DEBUG] Received event data: {event}")
        
        # Create event body from the received event data
        event_body = {
            'summary': event['title'],
            'description': event.get('description', ''),
            'start': {
                'dateTime': event['start_time'],
                'timeZone': 'IST',
            },
            'end': {
                'dateTime': event.get('end_time', event['start_time']),
                'timeZone': 'IST',
            },
            'location': event.get('location', '')
        }

        # Only add attendees if they have valid email addresses
        if event.get('participants'):
            valid_attendees = []
            for participant in event.get('participants', []):
                if isinstance(participant, dict) and participant.get('email'):
                    valid_attendees.append({'email': participant['email']})
            
            if valid_attendees:
                event_body['attendees'] = valid_attendees
                print(f"[DEBUG] Added valid attendees: {valid_attendees}")

        print(f"[DEBUG] Final event body: {event_body}")
        
        calendar_service = GoogleCalendar()
        result = calendar_service.create_event(google_credentials, event_body)
        print(f"[DEBUG] Event created successfully: {result}")
        return result

    except Exception as e:
        print(f"[DEBUG] Error adding event: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to add event to calendar."
        )