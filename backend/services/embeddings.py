from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
def get_embeddings(text):
    query_embedding = model.encode(text, normalize_embeddings=True)
    if hasattr(query_embedding, "tolist"):
        query_embedding = query_embedding.tolist()
    return query_embedding