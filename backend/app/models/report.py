from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .base import BaseModel
import enum

class ReportType(str, enum.Enum):
    EXCEL = "excel"
    PDF = "pdf"
    DASHBOARD = "dashboard"

class Report(BaseModel):
    __tablename__ = "reports"

    title = Column(String, nullable=False)
    description = Column(String)
    type = Column(Enum(ReportType), nullable=False)
    file_path = Column(String)  # Ruta al archivo generado (si aplica)
    parameters = Column(String)  # Parámetros usados para generar el reporte
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="reports")
    statistics = relationship("Statistic", secondary="report_statistics", back_populates="reports") 