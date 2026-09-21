from typing import Optional
from pydantic import BaseModel, Field


class Incident(BaseModel):
    """Model representing an incident report."""

    incident_id: Optional[int] = Field(None, description="Unique identifier")
    incident_title: str = Field(..., description="Title of the incident")
    incident_description: str = Field(..., description="Detailed description")
    incident_site: str = Field(..., description="Location where incident occurred")
    incident_severity: str = Field(..., description="Severity level (Low, Medium, High)")
    incident_reported_at: str = Field(..., description="Timestamp when reported")
    incident_created_at: Optional[str] = Field(None, description="Timestamp when created")
    incident_updated_at: Optional[str] = Field(None, description="Timestamp when last updated")
    incident_status: str = Field(default="Open", description="Status (Open or Closed)")






    
