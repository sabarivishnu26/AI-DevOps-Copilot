import os

from app.rag.retriever import retrieve


UPLOAD_DIR = "uploads"


def analyze_log(filename: str):

    path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(path):
        return {
            "error": "Log file not found."
        }

    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        log_content = f.read()

    docs = retrieve(log_content)

    results = []

    for doc in docs:

        results.append({
            "source": os.path.basename(doc.metadata["source"]),
            "content": doc.page_content
        })

    return {
        "uploaded_log": filename,
        "matches": results
    }