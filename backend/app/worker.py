from typing import List, Dict, Any
import pandas as pd
from pathlib import Path
from sqlalchemy.orm import Session

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.report import Report, ReportType
from app.core.pdf import create_html_report, generate_pdf

def get_db() -> Session:
    try:
        db = SessionLocal()
        return db
    finally:
        db.close()

@celery_app.task
def generate_excel_report(report_id: int) -> None:
    """
    Tarea Celery para generar reportes Excel
    """
    db = get_db()
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not report.statistics:
        return
    
    # Crear directorio si no existe
    Path("uploads/reports").mkdir(parents=True, exist_ok=True)
    
    # Crear un nuevo archivo Excel
    writer = pd.ExcelWriter(f"uploads/reports/{report_id}.xlsx", engine='openpyxl')
    
    # Para cada estadística en el reporte
    for stat in report.statistics:
        df = pd.DataFrame(stat.data)
        df.to_excel(writer, sheet_name=stat.title[:31], index=False)
    
    writer.save()
    
    # Actualizar la ruta del archivo en el reporte
    report.file_path = f"uploads/reports/{report_id}.xlsx"
    db.add(report)
    db.commit()

@celery_app.task
def generate_pdf_report(report_id: int) -> None:
    """
    Tarea Celery para generar reportes PDF
    """
    db = get_db()
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not report.statistics:
        return
    
    # Crear directorio si no existe
    Path("uploads/reports").mkdir(parents=True, exist_ok=True)
    
    # Preparar datos para el reporte
    statistics_data = []
    for stat in report.statistics:
        statistics_data.append({
            "title": stat.title,
            "description": stat.description,
            "data": stat.data,
            "metadata": stat.metadata
        })
    
    # Generar HTML
    html_content = create_html_report(
        title=report.title,
        description=report.description,
        statistics=statistics_data
    )
    
    # Generar PDF
    output_path = f"uploads/reports/{report_id}.pdf"
    generate_pdf(html_content, output_path)
    
    # Actualizar la ruta del archivo en el reporte
    report.file_path = output_path
    db.add(report)
    db.commit() 