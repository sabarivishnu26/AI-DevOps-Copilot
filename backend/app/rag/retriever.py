import os

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

retriever = db.as_retriever(
    search_kwargs={
        "k": 3
    }
)


def retrieve(query: str):
    return retriever.invoke(query)