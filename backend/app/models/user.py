from sqlalchemy import Boolean, Column, String, Enum
from sqlalchemy.orm import relationship
from .base import BaseModel
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    
    # Relaciones
    reports = relationship("Report", back_populates="user")
    dashboard_configs = relationship("DashboardConfig", back_populates="user") 