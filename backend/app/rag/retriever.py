import os
from typing import Optional
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

VECTOR_DB = os.path.join(BASE_DIR, "vectordb")

embedding_model = SentenceTransformerEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory=VECTOR_DB,
    embedding_function=embedding_model
)


def retrieve(query: str, category: Optional[str] = None):
    print("CATEGORY:", category)

    if category:
        results = db.similarity_search_with_score(
            query=query,
            k=3,
            filter={"category": category}
        )
        print("FILTERED RESULTS:", len(results))
        return results

    results = db.similarity_search_with_score(query=query, k=3)
    print("GENERAL RESULTS:", len(results))
    return results