from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from app.core.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.report import Report, ReportType
from app.models.statistic import Statistic
from app.schemas.report import ReportCreate, ReportUpdate, Report as ReportSchema
from app.worker import generate_excel_report, generate_pdf_report

router = APIRouter()

@router.get("/", response_model=List[ReportSchema])
def read_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve reports.
    """
    reports = db.query(Report).filter(Report.user_id == current_user.id).offset(skip).limit(limit).all()
    return reports

@router.post("/", response_model=ReportSchema)
async def create_report(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    report_in: ReportCreate,
) -> Any:
    """
    Create new report.
    """
    report = Report(
        title=report_in.title,
        description=report_in.description,
        type=report_in.type,
        parameters=report_in.parameters,
        user_id=current_user.id
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    # Generar el reporte en segundo plano usando Celery
    if report.type == ReportType.EXCEL:
        generate_excel_report.delay(report.id)
    elif report.type == ReportType.PDF:
        generate_pdf_report.delay(report.id)
    
    return report

@router.get("/{report_id}", response_model=ReportSchema)
def read_report(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    report_id: int,
) -> Any:
    """
    Get specific report by ID.
    """
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(
            status_code=404,
            detail="Reporte no encontrado"
        )
    return report

@router.put("/{report_id}", response_model=ReportSchema)
def update_report(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    report_id: int,
    report_in: ReportUpdate,
) -> Any:
    """
    Update a report.
    """
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(
            status_code=404,
            detail="Reporte no encontrado"
        )
    
    update_data = report_in.dict(exclude_unset=True)
    
    # Si el tipo de reporte cambia, regenerar el archivo
    if "type" in update_data and update_data["type"] != report.type:
        if report.file_path and os.path.exists(report.file_path):
            os.remove(report.file_path)
        report.file_path = None
    
    for field, value in update_data.items():
        setattr(report, field, value)
    
    db.add(report)
    db.commit()
    db.refresh(report)
    
    # Si el tipo cambió o no hay archivo, regenerar
    if not report.file_path:
        if report.type == ReportType.EXCEL:
            generate_excel_report.delay(report.id)
        elif report.type == ReportType.PDF:
            generate_pdf_report.delay(report.id)
    
    return report

@router.delete("/{report_id}")
def delete_report(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    report_id: int,
) -> Any:
    """
    Delete a report.
    """
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(
            status_code=404,
            detail="Reporte no encontrado"
        )
    
    # Eliminar el archivo si existe
    if report.file_path and os.path.exists(report.file_path):
        os.remove(report.file_path)
    
    db.delete(report)
    db.commit()
    return {"status": "success"}

@router.post("/{report_id}/statistics/{statistic_id}")
def add_statistic_to_report(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    report_id: int,
    statistic_id: int,
) -> Any:
    """
    Add a statistic to a report.
    """
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(
            status_code=404,
            detail="Reporte no encontrado"
        )
    
    statistic = db.query(Statistic).filter(Statistic.id == statistic_id).first()
    if not statistic:
        raise HTTPException(
            status_code=404,
            detail="Estadística no encontrada"
        )
    
    report.statistics.append(statistic)
    db.commit()
    
    # Regenerar el reporte con la nueva estadística
    if report.type == ReportType.EXCEL:
        generate_excel_report.delay(report.id)
    elif report.type == ReportType.PDF:
        generate_pdf_report.delay(report.id)
    
    return {"status": "success"} 