from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import json

from app.core.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.statistic import Statistic
from app.schemas.statistic import StatisticCreate, StatisticUpdate, Statistic as StatisticSchema

router = APIRouter()

@router.get("/", response_model=List[StatisticSchema])
def read_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve statistics.
    """
    statistics = db.query(Statistic).offset(skip).limit(limit).all()
    return statistics

@router.post("/upload", response_model=StatisticSchema)
async def create_statistic_from_excel(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    file: UploadFile = File(...),
    title: str,
    description: str = None,
    category: str,
) -> Any:
    """
    Create new statistic from Excel file.
    """
    if not file.filename.endswith(('.xls', '.xlsx')):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser un archivo Excel (.xls o .xlsx)"
        )
    
    try:
        df = pd.read_excel(file.file)
        data = df.to_dict(orient='records')
        
        statistic = Statistic(
            title=title,
            description=description,
            category=category,
            data=data,
            source_file=file.filename,
            metadata={
                "columns": list(df.columns),
                "rows": len(df)
            }
        )
        db.add(statistic)
        db.commit()
        db.refresh(statistic)
        return statistic
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error al procesar el archivo: {str(e)}"
        )

@router.get("/{statistic_id}", response_model=StatisticSchema)
def read_statistic(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    statistic_id: int,
) -> Any:
    """
    Get specific statistic by ID.
    """
    statistic = db.query(Statistic).filter(Statistic.id == statistic_id).first()
    if not statistic:
        raise HTTPException(
            status_code=404,
            detail="Estadística no encontrada"
        )
    return statistic

@router.put("/{statistic_id}", response_model=StatisticSchema)
def update_statistic(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    statistic_id: int,
    statistic_in: StatisticUpdate,
) -> Any:
    """
    Update a statistic.
    """
    statistic = db.query(Statistic).filter(Statistic.id == statistic_id).first()
    if not statistic:
        raise HTTPException(
            status_code=404,
            detail="Estadística no encontrada"
        )
    
    update_data = statistic_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(statistic, field, value)
    
    db.add(statistic)
    db.commit()
    db.refresh(statistic)
    return statistic

@router.delete("/{statistic_id}")
def delete_statistic(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    statistic_id: int,
) -> Any:
    """
    Delete a statistic.
    """
    statistic = db.query(Statistic).filter(Statistic.id == statistic_id).first()
    if not statistic:
        raise HTTPException(
            status_code=404,
            detail="Estadística no encontrada"
        )
    
    db.delete(statistic)
    db.commit()
    return {"status": "success"} 