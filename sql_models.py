from sqlalchemy import Column, Integer, String
from database import Base

class IncidentDB(Base):
    __tablename__ = "incidents"
    incident_id = Column(Integer, primary_key=True, autoincrement=True)
    incident_title = Column(String, nullable=False)
    incident_description = Column(String, nullable=False)
    incident_site = Column(String, nullable=False)
    incident_severity = Column(String, nullable=False)
    incident_reported_at = Column(String, nullable=False)
    incident_created_at = Column(String, nullable=False)
    incident_updated_at = Column(String, nullable=True)
    incident_status = Column(String, default="Open", nullable=False)
    reporter_id = Column(Integer, nullable=True)

class UserDB(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
