from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH'))
from services.llm import generate_response
from services.connect_db import supabase
from services.embeddings import get_embedding

search_router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    user_id: str
    threshold: float = 0.3
    match_count: int = 10

@search_router.post("/search")
async def hybrid_search(request: SearchRequest):
    try:
        print(f"[DEBUG] Received search request: {request.dict()}")
        # Generate query embedding
        query_embedding = get_embedding(request.query)
        print(f"[DEBUG] Generated query embedding: {query_embedding}")

        # Convert embedding to list for JSON serialization
        if hasattr(query_embedding, "tolist"):
            query_embedding = query_embedding.tolist()
        print(f"[DEBUG] Converted query embedding for JSON: {query_embedding}")

        # Execute hybrid search
        result = supabase.rpc('hybrid_search', {
            'query_text': request.query,
            'query_embedding': query_embedding,
            'user_id': request.user_id,
            'match_count': request.match_count,
            'full_text_weight': 0.6,
            'semantic_weight': 0.4
        }).execute()
        print(f"[DEBUG] Supabase RPC result: {result}")

        # Process results (remove threshold filtering, just sort by hybrid_score)
        sorted_results = sorted(result.data, key=lambda r: r['hybrid_score'], reverse=True)
        print(f"[DEBUG] Sorted results: {sorted_results}")

        # Generate LLM response
        llm_answer = None
        if sorted_results:
            context = "\n".join([f"{r['interaction_date']}: {r['details']}" for r in sorted_results])
            print(f"[DEBUG] LLM context: {context}")
            response = generate_response(
                f"Answer based on these interactions:\n{context}\n\nQuestion: {request.query}"
            )
            print(f"[DEBUG] LLM response: {response}")
            llm_answer = response

        return {
            "results": sorted_results,
            "llm_answer": llm_answer,
            "count": len(sorted_results)
        }
        
    except Exception as e:
        print(f"[ERROR] Exception in hybrid_search: {e}", file=sys.stderr)
        raise HTTPException(500, str(e))