from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

def get_embeddings(text) -> List[float]:
    query_embedding = model.encode(text, normalize_embeddings=True)
    # Convert to numpy array if not already
    if not isinstance(query_embedding, np.ndarray):
        query_embedding = np.array(query_embedding)
    
    # Ensure we have exactly 384 dimensions
    if len(query_embedding) != 384:
        raise ValueError(f"Expected embedding dimension of 384, got {len(query_embedding)}")
    
    # Convert numpy floats to Python floats
    return [float(x) for x in query_embedding.tolist()]