from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    filename: str
    root_cause: str
    possible_reasons: list[str]
    suggested_fixes: list[str]
    verification_commands: list[str]
    severity: str
    confidence_score: int
    retrieved_documents: list[str]