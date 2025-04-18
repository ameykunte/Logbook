from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import List, Optional
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
from services.google_calendar import GoogleCalendarService
from services.connect_db import supabase

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
        calendar_service = GoogleCalendarService()
        event_body = {
            'summary': event.summary,
            'description': event.description,
            'start': {
                'dateTime': event.start_time.isoformat(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': event.end_time.isoformat(),
                'timeZone': 'UTC',
            }
        }
        return calendar_service.create_event(google_credentials, event_body)
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
    print("[Debug] Getting auth URL for user_id:", token["user_id"])
    try:
        calendar_service = GoogleCalendarService()
        auth_url = calendar_service.get_auth_url(token["user_id"])
        print("[Debug] Generated auth URL:", auth_url)
        return {"auth_url": auth_url}
    except Exception as e:
        print("[Debug] Error generating auth URL:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@calendar_router.get("/oauth-callback")
async def google_oauth_callback(
    code: str,
    state: str,
    request: Request
):
    print("[Debug] Received OAuth callback - code:", code, "state:", state)
    try:
        calendar_service = GoogleCalendarService()
        credentials = calendar_service.get_credentials_from_code(code, state)
        print("[Debug] Got credentials from code")
        
        # Modified HTML content with better debugging and error handling
        html_content = """
            <html>
                <body>
                    <script>
                        try {
                            console.log('[Debug] Callback page loaded, preparing to send message');
                            const message = {
                                type: 'GOOGLE_AUTH',
                                code: '%s',
                                state: '%s',
                                credentials: %s
                            };
                            console.log('[Debug] Message to send:', message);
                            
                            if (window.opener) {
                                window.opener.postMessage(message, '*');  // Using * for development
                                console.log('[Debug] Message sent to opener');
                                setTimeout(() => window.close(), 1000);  // Delay closure
                            } else {
                                console.error('[Debug] No opener window found');
                            }
                        } catch (error) {
                            console.error('[Debug] Error in callback:', error);
                        }
                    </script>
                    <p>Authentication successful! You can close this window.</p>
                </body>
            </html>
        """ % (code, state, json.dumps(credentials))
        
        return HTMLResponse(content=html_content)
        
    except Exception as e:
        print("[Debug] Error in OAuth callback:", str(e))
        raise HTTPException(status_code=500, detail=str(e))