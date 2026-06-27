from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.orm import Session
import json

from app.services.analysis_service import analyze_log
from app.models.analysis import AnalysisResponse
from app.db.session import SessionLocal
from app.db.models import Incident

router = APIRouter(
    prefix="/api",
    tags=["Analysis"]
)


# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/analyze/{filename}",
)
async def analyze(
    filename: str,
    log_type: Optional[str] = None
):
    
    return analyze_log(
        filename,
        log_type
    )


@router.get("/incidents")
def list_incidents(db: Session = Depends(get_db)):
    """List all incidents in the history database, ordered by newest first."""
    incidents = db.query(Incident).order_by(Incident.id.desc()).all()
    results = []
    for inc in incidents:
        details = {}
        if inc.details_json:
            try:
                details = json.loads(inc.details_json)
            except Exception:
                pass
        results.append({
            "id": inc.id,
            "filename": inc.filename,
            "log_type": inc.log_type,
            "root_cause": inc.root_cause,
            "severity": inc.severity,
            "confidence_score": inc.confidence_score,
            "details": details
        })
    return results


@router.get("/incidents/{incident_id}")
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    """Get the full analysis details for a specific historical incident."""
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    details = {}
    if inc.details_json:
        try:
            details = json.loads(inc.details_json)
        except Exception:
            pass
            
    return {
        "id": inc.id,
        "filename": inc.filename,
        "log_type": inc.log_type,
        "root_cause": inc.root_cause,
        "severity": inc.severity,
        "confidence_score": inc.confidence_score,
        "details": details
    }


@router.delete("/incidents/{incident_id}")
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    """Delete an incident from the database history."""
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    db.delete(inc)
    db.commit()
    return {"status": "success", "message": f"Incident {incident_id} deleted."}


@router.get("/knowledge-base/{filename}")
def get_knowledge_base_doc(filename: str):
    """Search and return the content of a knowledge base markdown document."""
    import glob
    import os
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    KNOWLEDGE_BASE = os.path.join(BASE_DIR, "knowledge_base")
    
    # Recursively find the file under KNOWLEDGE_BASE folder
    matches = glob.glob(os.path.join(KNOWLEDGE_BASE, "**", filename), recursive=True)
    if not matches:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        with open(matches[0], "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return {"filename": filename, "content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))