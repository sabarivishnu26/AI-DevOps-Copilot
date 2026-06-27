import os
from typing import Optional

from app.rag.retriever import retrieve
from app.llm.gemini import generate
from app.rag.prompt import prompt
from app.utils.json_parser import parse_llm_json
from app.db.session import SessionLocal
from app.db.models import Incident

UPLOAD_DIR = "uploads"


def analyze_log(
    filename: str,
    log_type: Optional[str] = None
):

    # 1. Build file path
    path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(path):
        return {"error": "Log file not found."}

    # 2. Read log
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        log_content = f.read()
    print("=" * 50)
    print("LOG TYPE:", log_type)
    # 3. Retrieve relevant docs (WITH SCORES)
    results = retrieve(
        log_content,
        category=log_type
    )

    # 4. Split docs and scores
    docs = []
    scores = []

    for doc, score in results:
        docs.append(doc)
        scores.append(score)

    # 5. Build context
    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    # 6. Confidence score (vector similarity based)
    confidence = max(scores) if scores else 0
    confidence = round((1 - confidence) * 100, 2)

    # 7. Build prompt
    formatted_prompt = prompt.format(
        log=log_content,
        context=context,
        log_type=log_type or "general"
    )

    # 8. Call Gemini
    response = generate(formatted_prompt)

    # 9. Parse response
    analysis = parse_llm_json(response)
    print("=" * 60)
    print("AFTER PARSING")
    print(type(analysis))
    from pprint import pprint
    pprint(analysis)
    print("=" * 60)

    # 10. Attach metadata
    analysis["filename"] = filename
    analysis["confidence_score"] = confidence
    analysis["retrieved_documents"] = [
        os.path.basename(doc.metadata["source"])
        for doc in docs
    ]
    
    # 11. Save to Database
    import json
    db = SessionLocal()
    try:
        incident = Incident(
            filename=filename,
            log_type=log_type or "general",
            root_cause=analysis.get("root_cause", ""),
            severity=analysis.get("severity", "Unknown"),
            confidence_score=confidence,
            details_json=json.dumps(analysis)
        )
        db.add(incident)
        db.commit()
    except Exception as e:
        print(f"Error saving incident to database: {e}")
        db.rollback()
    finally:
        db.close()
    from pprint import pprint

    print("=" * 60)
    print("RETURNING ANALYSIS")
    pprint(analysis)
    print("=" * 60)

    return analysis