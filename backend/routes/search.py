from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from services.llm import generate_response
from services.connect_db import supabase
from services.embeddings import get_embeddings
from routes.auth import verify_jwt_token
from typing import List, Optional
from datetime import datetime

search_router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    match_count: int = 10

@search_router.post("/search")
async def hybrid_search(
    request: SearchRequest, 
    token: dict = Depends(verify_jwt_token) 
):
    try:
        user_id = token["user_id"]
        print(f"[DEBUG] Received search request: {request.dict()}")
        # Generate query embedding
        query_embedding = get_embeddings(request.query)
        print(f"[DEBUG] Generated query embedding: {query_embedding}")

        # Execute hybrid search
        result = supabase.rpc('hybrid_search', {
            'query_text': request.query,
            'query_embedding': query_embedding,
            'user_id': user_id,
            'match_count': request.match_count,
            'full_text_weight': 0.6,
            'semantic_weight': 0.4
        }).execute()
        print(f"[DEBUG] Supabase RPC result: {result}")
        
        result.data = result.data[:request.match_count] if result.data else []

        # Process results (remove threshold filtering, just sort by hybrid_score)
        sorted_results = sorted(result.data, key=lambda r: r['hybrid_score'], reverse=True)
        print(f"[DEBUG] Sorted results: {sorted_results}")

        # Generate LLM response
        llm_answer = None
        if sorted_results:
            system_prompt = "You are a helpful assistant. Answer the user's question based on the provided interactions. Dont answer like based on the interactions/information, just answer the question as he is asking you directly."
            context = "\n".join([f"{r['date']}: {r['content']} (with {r['name']})" for r in sorted_results])
            print(f"[DEBUG] LLM context: {context}")
            response = generate_response(
                f" Instructions:\n{system_prompt}\n\nContext:\n{context}\n\nQuestion: {request.query}"
            )
            print(f"[DEBUG] LLM response: {response}")
            llm_answer = response

        return {
            "results": [{
                "name": r["name"],
                "date": r["date"],
                "content": r["content"],
                "hybrid_score": r["hybrid_score"]
            } for r in sorted_results],
            "llm_answer": llm_answer,
            "count": len(sorted_results)
        }
        
    except Exception as e:
        print(f"[ERROR] Exception in hybrid_search: {e}", file=sys.stderr)
        raise HTTPException(500, str(e))