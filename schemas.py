from pydantic import BaseModel, AwareDatetime, ConfigDict
from typing import Literal, Optional
from datetime import datetime

Severity = Literal["Low", "Medium", "High", "Critical"]

class IncidentCreate(BaseModel):
    """Data for creating an incident."""
    incident_title: str
    incident_description: str
    incident_site: str
    incident_severity: Optional[Severity] = None
    incident_reported_at: AwareDatetime

class IncidentOut(BaseModel):
    """Data for returning an incident."""
    model_config = ConfigDict(from_attributes=True)

    incident_id: int
    incident_title: str
    incident_description: str
    incident_site: str
    incident_severity: Optional[Severity]
    incident_reported_at: datetime
    incident_created_at: datetime
    incident_updated_at: Optional[datetime]
    incident_status: Literal["Open", "Closed"]
    reporter_id: Optional[int]

class UserRegister(BaseModel):
    """Data for registering a new user."""
    email: str
    password: str

class UserLogin(BaseModel):
    """Data for logging in."""
    email: str
    password: str

class TokenResponse(BaseModel):
    """Response with JWT token."""
    access_token: str
    token_type: str

class RegistrationResponse(BaseModel):
    """Response after successful registration."""
    message: str
    email: str

class UserResponse(BaseModel):
    """User info (no password!)."""
    user_id: int
    email: str
