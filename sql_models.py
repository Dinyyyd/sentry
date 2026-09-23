from sqlalchemy import Column, Integer, String, DateTime, CheckConstraint, func
from database import Base


class IncidentDB(Base):
    __tablename__ = "incidents"

    incident_id = Column(Integer, primary_key=True, autoincrement=True)
    incident_title = Column(String, nullable=False)
    incident_description = Column(String, nullable=False)
    incident_site = Column(String, nullable=False)

    # nullable=True: severity can be empty ("not decided yet")
    incident_severity = Column(String, nullable=True)

    # timezone=True: PostgreSQL uses TIMESTAMPTZ (stores the timezone)
    incident_reported_at = Column(DateTime(timezone=True), nullable=False)
    incident_created_at = Column(DateTime(timezone=True), nullable=False,
                                 server_default=func.now())
    incident_updated_at = Column(DateTime(timezone=True), nullable=True)

    incident_status = Column(String, nullable=False, server_default="Open")
    reporter_id = Column(Integer, nullable=True)

    # Rules enforced by the database itself
    __table_args__ = (
        CheckConstraint(
            "incident_severity IS NULL OR incident_severity IN ('Low','Medium','High','Critical')",
            name="ck_incident_severity",
        ),
        CheckConstraint(
            "incident_status IN ('Open','Closed')",
            name="ck_incident_status",
        ),
    )


class UserDB(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
