from sqlalchemy import Column, String, JSON, ForeignKey, Boolean, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class DashboardConfig(BaseModel):
    __tablename__ = "dashboard_configs"

    name = Column(String, nullable=False)
    layout = Column(JSON, nullable=False)  # Configuración del layout en formato JSON
    widgets = Column(JSON, nullable=False)  # Lista de widgets y sus configuraciones
    is_default = Column(Boolean, default=False)
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="dashboard_configs") 