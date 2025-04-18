import os
import threading
import time
from fastapi import HTTPException
import google.generativeai as genai

class TokenBucketLimiter:
    """
    A thread‑safe token‑bucket rate limiter decorator.
    Allows up to max_calls per period (in seconds).
    """
    def __init__(self, max_calls: int, period: float):
        self.max_calls = max_calls
        self.period = period
        self.lock = threading.Lock()
        self.calls: list[float] = []

    def __call__(self, fn):
        def wrapper(*args, **kwargs):
            now = time.time()
            window_start = now - self.period

            with self.lock:
                # drop timestamps outside the window
                self.calls = [t for t in self.calls if t > window_start]

                if len(self.calls) >= self.max_calls:
                    raise HTTPException(
                        status_code=429,
                        detail=f"LLM rate limit exceeded ({self.max_calls}/{self.period}s)"
                    )

                # record this call
                self.calls.append(now)

            return fn(*args, **kwargs)

        # copy metadata
        wrapper.__name__ = fn.__name__
        wrapper.__doc__ = fn.__doc__
        return wrapper


# configure the Gemini client once
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
_model = genai.GenerativeModel("gemini-2.0-flash")


@TokenBucketLimiter(max_calls=3, period=10.0)
def generate_response(prompt: str) -> str:
    """
    Synchronously calls Gemini and returns text.
    If we exceed 5 calls/sec we automatically 429.
    """
    try:
        # blocking call
        resp = _model.generate_content(prompt)
        return resp.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {e}")
