from googleapiclient.discovery import build
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from .calendar_strategy import CalendarStrategy
import os
from dotenv import load_dotenv

load_dotenv()

class GoogleCalendar(CalendarStrategy):
    def __init__(self):
        """
        Initialize the Google Calendar service with client configuration and scopes.
        """
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

    def create_event(self, credentials_json: dict, event_details: dict):
        """
        Create an event in Google Calendar.
        """
        credentials = Credentials.from_authorized_user_info(credentials_json, self.scopes)
        service = build('calendar', 'v3', credentials=credentials)
        return service.events().insert(calendarId='primary', body=event_details).execute()

    def get_auth_url(self, user_id: str) -> str:
        """
        Generate the Google OAuth 2.0 authorization URL.
        """
        flow = Flow.from_client_config(
            self.client_config,
            scopes=self.scopes,
            redirect_uri=self.client_config["web"]["redirect_uris"][0]
        )
        auth_url, _ = flow.authorization_url(
            access_type='offline',
            prompt='consent',
            state=user_id,
            include_granted_scopes='true'
        )
        return auth_url

    def get_credentials_from_code(self, code: str, user_id: str) -> dict:
        """
        Exchange the authorization code for Google credentials.
        """
        flow = Flow.from_client_config(
            self.client_config,
            scopes=self.scopes,
            redirect_uri=self.client_config["web"]["redirect_uris"][0]
        )
        flow.fetch_token(code=code)
        credentials = flow.credentials
        return {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }