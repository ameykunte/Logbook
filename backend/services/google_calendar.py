from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv
import os
from google.auth.transport.requests import Request
import json

load_dotenv()

class GoogleCalendarService:
    def __init__(self):
        self.client_config = {
            "web": {
                "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                "project_id": os.getenv("GOOGLE_PROJECT_ID"),
                "auth_uri": os.getenv("GOOGLE_AUTH_URI"),
                "token_uri": os.getenv("GOOGLE_TOKEN_URI"),
                "auth_provider_x509_cert_url": os.getenv("GOOGLE_AUTH_PROVIDER_CERT_URL"),
                "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                "redirect_uris": [
                    os.getenv("GOOGLE_REDIRECT_URI"),
                    f"{os.getenv('REACT_FRONTEND_URL')}/api/calendar/oauth-callback"
                ],
                "javascript_origins": [
                    os.getenv("REACT_FRONTEND_URL"),
                    os.getenv("REACT_APP_API_URL")
                ]
            }
        }
        self.scopes = ['https://www.googleapis.com/auth/calendar.events']

    def get_auth_url(self, user_id: str) -> str:
        print("[Debug] Creating Flow with config:", self.client_config)
        flow = Flow.from_client_config(
            self.client_config,
            scopes=self.scopes,
            redirect_uri=self.client_config["web"]["redirect_uris"][0]
        )
        auth_url, _ = flow.authorization_url(
            # Force to always get refresh token
            access_type='offline',
            prompt='consent',  # Add this to force consent screen
            state=user_id,
            include_granted_scopes='true'
        )
        print("[Debug] Generated auth URL:", auth_url)
        return auth_url

    def get_credentials_from_code(self, code: str, user_id: str) -> dict:
        print("[Debug] Getting credentials from code:", code)
        flow = Flow.from_client_config(
            self.client_config,
            scopes=self.scopes,
            redirect_uri=self.client_config["web"]["redirect_uris"][0]
        )
        print("[Debug] Fetching token")
        flow.fetch_token(code=code)
        credentials = flow.credentials
        print("[Debug] Got credentials, converting to dict")
        
        creds_dict = {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }
        
        print("[Debug] Credentials dict created")
        return creds_dict

    def create_event(self, credentials_json: dict, event_details: dict):
        """Create a calendar event with proper credential handling and debug logging"""
        try:
            print(f"[DEBUG] Creating event with credentials: {credentials_json}")
            print(f"[DEBUG] Event details: {event_details}")
            
            # Validate credentials contain required fields
            required_fields = ['refresh_token', 'token_uri', 'client_id', 'client_secret']
            missing_fields = [field for field in required_fields if not credentials_json.get(field)]
            
            if missing_fields:
                print(f"[DEBUG] Missing credential fields: {missing_fields}")
                raise ValueError(f"Missing required credential fields: {missing_fields}")

            # Create credentials object
            credentials = Credentials.from_authorized_user_info(
                credentials_json, 
                self.scopes
            )

            # Check if credentials need refresh
            if not credentials.valid:
                print("[DEBUG] Credentials expired, attempting refresh")
                if credentials.refresh_token:
                    credentials.refresh(Request())
                    print("[DEBUG] Credentials refreshed successfully")
                else:
                    raise ValueError("No refresh token available")

            # Build service and create event
            print("[DEBUG] Building calendar service")
            service = build('calendar', 'v3', credentials=credentials)
            
            print("[DEBUG] Inserting event")
            result = service.events().insert(calendarId='primary', body=event_details).execute()
            print(f"[DEBUG] Event created successfully: {result.get('id')}")
            
            return result

        except ValueError as ve:
            print(f"[DEBUG] Validation error: {str(ve)}")
            raise
        except Exception as e:
            print(f"[DEBUG] Calendar API error: {str(e)}")
            print(f"[DEBUG] Error type: {type(e)}")
            import traceback
            print(f"[DEBUG] Traceback: {traceback.format_exc()}")
            raise