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
from typing import Optional, Dict, Any
from abc import ABC, abstractmethod

search_router = APIRouter()

class SearchStrategy(ABC):
    @abstractmethod
    def execute(
        self, 
        query_text: str,
        user_id: str,
        match_count: int,
        query_embedding: Optional[list] = None
    ) -> list:
        pass

# Concrete Strategies
class KeywordSearchStrategy(SearchStrategy):
    def execute(self, query_text, user_id, match_count, **kwargs):
        return supabase.rpc('keyword_search', {
            'query_text': query_text,
            'user_id': user_id,
            'match_count': match_count
        }).execute().data

class SemanticSearchStrategy(SearchStrategy):
    def execute(self, query_text, user_id, match_count, query_embedding, **kwargs):
        return supabase.rpc('semantic_search', {
            'query_embedding': query_embedding,
            'user_id': user_id,
            'match_count': match_count
        }).execute().data

class HybridSearchStrategy(SearchStrategy):
    def execute(
        self,
        query_text,
        user_id,
        match_count,
        query_embedding,
        full_text_weight=0.6,
        semantic_weight=0.4,
        **kwargs
    ):
        return supabase.rpc('hybrid_search', {
            'query_text': query_text,
            'query_embedding': query_embedding,
            'user_id': user_id,
            'match_count': match_count,
            'full_text_weight': full_text_weight,
            'semantic_weight': semantic_weight
        }).execute().data

# Strategy Factory
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

# Updated Search Request Model
class SearchRequest(BaseModel):
    query: str
    search_type: str = "hybrid"
    match_count: int = 15
    params: Optional[Dict[str, Any]] = None  # Additional strategy-specific params

# Updated Search Endpoint
@search_router.post("/search")
async def search(
    request: SearchRequest, 
    token: dict = Depends(verify_jwt_token)
):
    try:
        user_id = token["user_id"]
        strategy = SearchStrategyFactory.get_strategy(request.search_type)
        
        # Generate embedding only if needed
        query_embedding = None
        if request.search_type in ['semantic', 'hybrid']:
            query_embedding = get_embeddings(request.query)
            if hasattr(query_embedding, "tolist"):
                query_embedding = query_embedding.tolist()

        # Execute strategy with parameters
        result_data = strategy.execute(
            query_text=request.query,
            user_id=user_id,
            match_count=request.match_count,
            query_embedding=query_embedding,
            **(request.params or {})
        )

        # Process results
        if request.search_type == 'hybrid':
            sorted_results = sorted(result_data, key=lambda r: r['hybrid_score'], reverse=True)
        if request.search_type == 'keyword':
            sorted_results = sorted(result_data, key=lambda r: r['search_score'], reverse=True)
        if request.search_type == 'semantic':
            sorted_results = sorted(result_data, key=lambda r: r['semantic_score'], reverse=True)
        sorted_results = sorted_results[:request.match_count]
        
        # Generate LLM response
        llm_answer = None
        if sorted_results:
            system_prompt = "You are a helpful assistant. Answer the user's question based on the provided interactions. Don't answer like 'based on the interactions/information', just answer the question directly."
            context = "\n".join([f"{r['date']}: {r['content']} (with {r['name']})" for r in sorted_results[:5]])
            print(f"[DEBUG] LLM context: {context}")
            response = generate_response(
                f" Instructions:\n{system_prompt}\n\nContext:\n{context}\n\nQuestion: {request.query}"
            )
            llm_answer = response

        return {
            "results": [{
                "name": r["name"],
                "date": r["date"],
                "content": r["content"],
                "score": (
                    r.get('hybrid_score')
                    if request.search_type == 'hybrid' else
                    r.get('search_score')
                    if request.search_type == 'keyword' else
                    r.get('semantic_score', 0.0)
                )
            } for r in sorted_results],
            "llm_answer": llm_answer,
            "count": len(sorted_results)
        }
        
    except Exception as e:
        print(f"[ERROR] Exception in search: {e}", file=sys.stderr)
        raise HTTPException(500, str(e))