from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
def get_embedding(text):
    return model.encode(text, normalize_embeddings=True)