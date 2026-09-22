from pydantic import BaseModel
from typing import Optional

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

class IncidentCreate(BaseModel):
    """Data for creating an incident."""
    incident_title: str
    incident_description: str
    incident_site: str
    incident_severity: str
    incident_reported_at: str
