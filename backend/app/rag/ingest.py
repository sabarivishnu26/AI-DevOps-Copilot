import os

from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader

from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_community.embeddings import SentenceTransformerEmbeddings

from langchain_community.vectorstores import Chroma

# ------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

KNOWLEDGE_BASE = os.path.join(BASE_DIR, "knowledge_base")

VECTOR_DB = os.path.join(BASE_DIR, "vectordb")

# ------------------------

print("Loading knowledge base...")

loader = DirectoryLoader(
    KNOWLEDGE_BASE,
    glob="**/*.md",
    loader_cls=TextLoader
)

documents = loader.load()

print(f"Loaded {len(documents)} documents.")

# ------------------------

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

chunks = splitter.split_documents(documents)

print(f"Created {len(chunks)} chunks.")

# ------------------------

embedding_model = SentenceTransformerEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

# ------------------------

print("Generating embeddings...")

db = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    persist_directory=VECTOR_DB
)

db.persist()

print("Vector database created successfully.")