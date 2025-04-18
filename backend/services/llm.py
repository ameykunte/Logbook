import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

SYSTEM_PROMPT = (
    "You are a concise note-taking assistant. "
    "Given user text and zero or more image URLs, "
    "you must reply with STRICT JSON ONLY, formatted exactly as: "
    "{\"summary\":\"<concise summary>\"} and nothing else."
)

def generate_summary(text: str, image_urls: list[str]) -> str:
    payload = json.dumps({"text": text, "images": image_urls})
    resp = model.generate_content([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": payload}
    ])
    try:
        result = json.loads(resp.text)
        return result.get("summary", "")
    except json.JSONDecodeError:
        print("LLM returned invalid JSON:", resp.text)
        return ""
