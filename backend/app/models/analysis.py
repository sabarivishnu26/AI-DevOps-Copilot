from pydantic import BaseModel, Field

class AnalysisResponse(BaseModel):
    filename: str
    root_cause: str
    possible_reasons: list[str] = Field(default_factory=list)
    suggested_fixes: list[str] = Field(default_factory=list)
    verification_commands: list[str] = Field(default_factory=list)
    severity: str
    confidence_score: float
    retrieved_documents: list[str] = Field(default_factory=list)