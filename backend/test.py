from app.rag.retriever import retrieve

query = """
CrashLoopBackOff
Back-off restarting failed container
Readiness probe failed
"""

docs = retrieve(query)

for doc in docs:

    print("=" * 50)

    print(doc.page_content)

    print(doc.metadata)