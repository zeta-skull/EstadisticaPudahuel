from sqlalchemy import Column, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Statistic(BaseModel):
    __tablename__ = "statistics"

    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String, nullable=False)
    data = Column(JSON, nullable=False)  # Almacena los datos en formato JSON
    source_file = Column(String)  # Nombre del archivo Excel de origen
    metadata = Column(JSON)  # Metadatos adicionales como unidades, fechas, etc.
    
    # Relaciones
    reports = relationship("Report", secondary="report_statistics", back_populates="statistics")

# Tabla de asociación para la relación muchos a muchos entre Report y Statistic
class ReportStatistic(BaseModel):
    __tablename__ = "report_statistics"

    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    statistic_id = Column(Integer, ForeignKey("statistics.id"), primary_key=True) 