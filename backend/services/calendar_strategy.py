from abc import ABC, abstractmethod

class CalendarStrategy(ABC):
    @abstractmethod
    def create_event(self, credentials_json: dict, event_details: dict):
        """
        Abstract method to create an event in a calendar.
        """
        pass

    @abstractmethod
    def get_auth_url(self, user_id: str) -> str:
        """
        Abstract method to get the authorization URL for the calendar provider.
        """
        pass

    @abstractmethod
    def get_credentials_from_code(self, code: str, user_id: str) -> dict:
        """
        Abstract method to exchange an authorization code for credentials.
        """
        pass