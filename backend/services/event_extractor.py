import os
from typing import List, Optional
from pydantic import BaseModel
import google.generativeai as genai
from fastapi import HTTPException
import json
from datetime import datetime

# Initialize Gemini API with your API key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

class EventDetails(BaseModel):
    title: str
    start_time: str
    end_time: Optional[str]
    description: Optional[str]
    location: Optional[str]
    participants: Optional[List[dict]] = []  # Make it optional with default empty list
    confidence_score: float

async def extract_events_from_interaction(text: str, relation_info: dict) -> List[EventDetails]:
    """Extract potential calendar events from interaction text with relation context"""
    
    interaction_date = relation_info.get('interaction_date')
    print(f"[DEBUG] Processing with interaction date: {interaction_date}")
    
    # Pre-format the participant template to avoid f-string issues
    current_person = {
        "name": relation_info.get('name', 'Unknown'),
        "email": relation_info.get('email', 'Unknown')
    }
    
    system_prompt = f"""
    You are an AI assistant that extracts calendar events from conversation logs and interactions.
    
    Context Information:
    - Current Person: {current_person['name']} ({current_person['email']})
    - Company: {relation_info.get('company', 'Unknown')}
    - Interaction Date: {interaction_date}
    
    IMPORTANT RULES:
    1. Date and Time Rules:
       - Use the interaction date ({interaction_date}) as reference point
       - For relative dates:
         * "yesterday" -> Day before interaction date
         * "tomorrow" -> Day after interaction date
         * "next week" -> Add 7 days to interaction date
         * "next month" -> Add 1 month to interaction date
       - For times:
         * No time mentioned -> Use 12:00 PM
         * "morning" -> Use 9:00 AM
         * "afternoon" -> Use 2:00 PM
         * "evening" -> Use 6:00 PM
       - Set end time 1 hour after start if not specified
       - Use 24-hour format
    
    2. Participant Rules:
       - DO NOT include participants without valid email addresses
       - Instead, add mentioned people's names to the description field
       - Example: If "Meeting with John and Sarah" but no emails known, add to description: 
         "Meeting attendees: John, Sarah"
       - Format participants array as:
           "participants": [
               {{"name": "{current_person['name']}", "email": "{current_person['email']}"}}
           ]
    
    Format your response as a JSON array:
    [
        {{
            "title": "Brief, clear event title",
            "start_time": "YYYY-MM-DDTHH:MM:SS",
            "end_time": "YYYY-MM-DDTHH:MM:SS",
            "description": "Detailed event description including any mentioned attendees without emails",
            "location": "Event location or null",
            "participants": [
                {{"name": "{current_person['name']}", "email": "{current_person['email']}"}}
            ],
            "confidence_score": 0.95
        }}
    ]

    IMPORTANT: Return ONLY the raw JSON array, no markdown, no code blocks, no other text.
    """

    try:
        prompt = f"{system_prompt}\n\nText to analyze:\n{text}"
        print("[DEBUG] Processing text with date context")
        response = model.generate_content(prompt)
        print(f"[DEBUG] Raw Gemini response: {response.text}")
        
        # Clean the response text
        cleaned_response = response.text.strip()
        cleaned_response = cleaned_response.replace('```json', '').replace('```', '').strip()
        print(f"[DEBUG] Cleaned response: {cleaned_response}")
        
        try:
            events_data = json.loads(cleaned_response)
            print(f"[DEBUG] Parsed JSON data: {events_data}")
        except json.JSONDecodeError as je:
            print(f"[DEBUG] JSON parsing error: {str(je)}")
            if not cleaned_response.startswith('['):
                cleaned_response = f"[{cleaned_response}]"
                print(f"[DEBUG] Attempting with wrapped response: {cleaned_response}")
                events_data = json.loads(cleaned_response)
        
        if not isinstance(events_data, list):
            events_data = [events_data]
        
        events = []
        for event_data in events_data:
            try:
                print(f"[DEBUG] Processing event: {event_data}")
                event = EventDetails(**event_data)
                events.append(event)
                print(f"[DEBUG] Successfully added event: {event}")
            except Exception as e:
                print(f"[DEBUG] Error processing event: {str(e)}")
                continue
        
        return events
        
    except Exception as e:
        print(f"[DEBUG] Fatal error in event extraction: {str(e)}")
        print(f"[DEBUG] Error type: {type(e)}")
        import traceback
        print(f"[DEBUG] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to extract events: {str(e)}")