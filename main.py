from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from models import Incident
from sql_models import IncidentDB, UserDB
from database import Base, SessionLocal, engine, get_db
from fastapi import Header
from schemas import UserRegister, UserLogin, TokenResponse, IncidentCreate
from auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://sentry-lilac-pi.vercel.app",
                   "https://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Helper Functions ============

def get_current_timestamp() -> str:
    """Get current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).isoformat() + "Z"

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Extract user from token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    email = decode_access_token(token)
    
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# ============ API Routes ============

@app.get("/incidents", response_model=list[Incident], status_code=status.HTTP_200_OK)
def get_incidents(db: Session = Depends(get_db)):
    """Get all incidents from the database."""
    incidents = db.query(IncidentDB).all()
    return incidents


@app.get("/incidents/{incident_id}", response_model=Incident, status_code=status.HTTP_200_OK)
def get_incident_by_id(incident_id: int, db: Session = Depends(get_db)):
    """Get a single incident by ID."""
    incident = db.query(IncidentDB).filter(IncidentDB.incident_id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return incident


@app.post("/incidents", response_model=Incident, status_code=status.HTTP_201_CREATED)
def create_incident(
    incident_data: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user),
):
    """Create a new incident for the authenticated user."""
    new_incident = IncidentDB(
        incident_title=incident_data.incident_title,
        incident_description=incident_data.incident_description,
        incident_site=incident_data.incident_site,
        incident_severity=incident_data.incident_severity,
        incident_reported_at=incident_data.incident_reported_at,
        incident_created_at=get_current_timestamp(),
        incident_status="Open",
        reporter_id=current_user.user_id
    )
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return new_incident


@app.post("/incidents/{incident_id}/close", response_model=Incident, status_code=status.HTTP_200_OK)
def close_incident(incident_id: int, db: Session = Depends(get_db)):
    """Close an open incident."""
    incident = db.query(IncidentDB).filter(IncidentDB.incident_id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    if incident.incident_status == "Closed":
        raise HTTPException(status_code=400, detail=f"Incident {incident_id} is already closed")

    incident.incident_status = "Closed"
    incident.incident_updated_at = get_current_timestamp()
    db.commit()
    db.refresh(incident)
    return incident

# ============ Register ============
@app.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user. Hash password before storing."""
    # Check if user exists
    existing_user = db.query(UserDB).filter(UserDB.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password - NEVER store the plain password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    new_user = UserDB(
        email=user_data.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return token
    token = create_access_token(new_user.email)
    return {"access_token": token, "token_type": "bearer"}


# ============ Login ============
@app.post("/login", response_model=TokenResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user. Verify password hash matches."""
    user = db.query(UserDB).filter(UserDB.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password against hash
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Return token
    token = create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer"}


# ============ Create Incident (Now requires auth) ============
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
