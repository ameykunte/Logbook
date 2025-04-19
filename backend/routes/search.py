import asyncio
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.getenv('HOME_PATH', '.')) # Added default '.' for safety
from services.llm import generate_response
from services.connect_db import supabase
from services.embeddings import get_embeddings
from routes.auth import verify_jwt_token
from typing import Optional, List, Dict, Any
from abc import ABC, abstractmethod

# Import run_in_threadpool for running sync blocking code efficiently
from fastapi.concurrency import run_in_threadpool
from core.limiter import limiter
from starlette.requests import Request

search_router = APIRouter()


class SearchStrategy(ABC):
    @abstractmethod
    async def execute(
        self,
        query_text: str,
        user_id: str,
        match_count: int,
        **kwargs # Accept potential query_embedding and other params
    ) -> list:
        pass

class KeywordSearchStrategy(SearchStrategy):
    async def execute(self, query_text, user_id, match_count, **kwargs):
        try:
            response = await run_in_threadpool(
                supabase.rpc('keyword_search', {
                    'query_text': query_text,
                    'user_id': user_id,
                    'match_count': match_count
                }).execute
            )
            return response.data
        except Exception as e:
            print(f"[ERROR] Keyword search failed: {e}", file=sys.stderr)
            raise HTTPException(status_code=500, detail="Keyword search failed")

class SemanticSearchStrategy(SearchStrategy):
    async def execute(self, query_text, user_id, match_count, query_embedding, **kwargs):
        if query_embedding is None:
             raise ValueError("Semantic search requires query_embedding.")
        try:
            response = await run_in_threadpool(
                 supabase.rpc('semantic_search', {
                    'query_embedding': query_embedding,
                    'user_id': user_id,
                    'match_count': match_count,
                }).execute
            )
            return response.data
        except Exception as e:
            print(f"[ERROR] Semantic search failed: {e}", file=sys.stderr)
            raise HTTPException(status_code=500, detail="Semantic search failed")

class HybridSearchStrategy(SearchStrategy):
    async def execute(
        self,
        query_text,
        user_id,
        match_count,
        query_embedding,
        full_text_weight=0.6,
        semantic_weight=0.4,
        **kwargs 
    ):
        if query_embedding is None:
             raise ValueError("Hybrid search requires query_embedding.")
        try:
            response = await run_in_threadpool(
                supabase.rpc('hybrid_search', {
                    'query_text': query_text,
                    'query_embedding': query_embedding,
                    'user_id': user_id,
                    'match_count': match_count,
                    'full_text_weight': full_text_weight,
                    'semantic_weight': semantic_weight
                }).execute
            )
            return response.data
        except Exception as e:
            print(f"[ERROR] Hybrid search failed: {e}", file=sys.stderr)
            raise HTTPException(status_code=500, detail="Hybrid search failed")

# --- Strategy Factory ---
class SearchStrategyFactory:
    _strategies = {
        'keyword': KeywordSearchStrategy(),
        'semantic': SemanticSearchStrategy(),
        'hybrid': HybridSearchStrategy()
    }

    @classmethod
    def get_strategy(cls, search_type: str) -> SearchStrategy:
        strategy = cls._strategies.get(search_type.lower())
        if not strategy:
            raise ValueError(f"Invalid search type: {search_type}")
        return strategy

# --- Request Model ---
class SearchRequest(BaseModel):
    query: str
    search_type: str = "hybrid"
    match_count: int = 15
    params: Optional[Dict[str, Any]] = None

# --- Search Endpoint ---
@search_router.post("/search")
async def search(
    request: Request,
    search_data: SearchRequest,
    token: dict = Depends(verify_jwt_token)
):
    @limiter.limit("10/minute")
    def rate_limit_search(request: Request):
        return True
    rate_limit_search(request)
    
    try:
        user_id = token["user_id"]
        strategy = SearchStrategyFactory.get_strategy(search_data.search_type)
        strategy_params = search_data.params or {}

        # --- Handle Embeddings (CPU Bound) ---
        query_embedding = None
        if search_data.search_type in ['semantic', 'hybrid']:
            try:
                query_embedding = await run_in_threadpool(get_embeddings, search_data.query)
            except Exception as e:
                print(f"[ERROR] Failed to get embeddings: {e}", file=sys.stderr)
                raise HTTPException(status_code=500, detail="Failed to generate query embeddings")

        result_data = await strategy.execute(
            query_text=search_data.query,
            user_id=user_id,
            match_count=search_data.match_count,
            query_embedding=query_embedding,
            **strategy_params
        )

        if not isinstance(result_data, list):
             print(f"[WARNING] Search strategy returned non-list data: {type(result_data)}", file=sys.stderr)
             result_data = [] 
             
        score_key = 'hybrid_score' if search_data.search_type == 'hybrid' else \
                    'search_score' if search_data.search_type == 'keyword' else \
                    'semantic_score'

        sorted_results = sorted(
            result_data,
            key=lambda r: r.get(score_key, 0.0),
            reverse=True
        )
        sorted_results = sorted_results[:search_data.match_count]

        # --- Generate LLM Response (Sync Network I/O) ---
        llm_answer = None
        if sorted_results:
            try:
                system_prompt = "You are a helpful assistant. Answer the user's question based on the provided interactions. Don't answer like 'based on the interactions/information', just answer the question directly."
                context = "\n".join([f"{r.get('date', 'Unknown Date')}: {r.get('content', '')} (with {r.get('name', 'Unknown Name')})" for r in sorted_results[:5]]) # Limit to top 5 for context

                llm_prompt = f"Instructions:\n{system_prompt}\n\nContext:\n{context}\n\nQuestion: {search_data.query}"
                print(f"[DEBUG] LLM prompt generated (length: {len(llm_prompt)})") # Avoid printing full context/prompt

                llm_answer = await run_in_threadpool(generate_response, llm_prompt)

            except HTTPException as e:
                 # Re-raise HTTP exceptions (like rate limiting from generate_response)
                 raise e
            except Exception as e:
                # Log error but don't fail the whole search if LLM fails
                print(f"[ERROR] Failed to generate LLM summary: {e}", file=sys.stderr)
                llm_answer = "Error generating summary." # Indicate LLM failure

        # --- Format Final Response ---
        return {
            "results": [{
                "name": r.get("name"),
                "date": r.get("date"),
                "content": r.get("content"),
                "score": r.get(score_key, 0.0) # Use safe access
            } for r in sorted_results],
            "llm_answer": llm_answer,
            "count": len(sorted_results)
        }

    except ValueError as e: # Catch specific errors like invalid search type
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException as e:
        # Re-raise known HTTP exceptions
        raise e
    except Exception as e:
        # Catch-all for unexpected errors
        print(f"[ERROR] Unexpected error in search endpoint: {e}", file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")