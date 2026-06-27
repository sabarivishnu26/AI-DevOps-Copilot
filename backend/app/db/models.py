from sqlalchemy import Column, Integer, String, Text, Float
from app.db.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    log_type = Column(String)
    root_cause = Column(Text)
    severity = Column(String)
    confidence_score = Column(Float)
    details_json = Column(Text, nullable=True)