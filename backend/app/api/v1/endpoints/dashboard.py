from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.dashboard import DashboardConfig
from app.schemas.dashboard import DashboardConfigCreate, DashboardConfigUpdate, DashboardConfig as DashboardConfigSchema

router = APIRouter()

@router.get("/", response_model=List[DashboardConfigSchema])
def read_dashboard_configs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve dashboard configurations.
    """
    configs = db.query(DashboardConfig).filter(
        DashboardConfig.user_id == current_user.id
    ).all()
    return configs

@router.post("/", response_model=DashboardConfigSchema)
def create_dashboard_config(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    config_in: DashboardConfigCreate,
) -> Any:
    """
    Create new dashboard configuration.
    """
    if config_in.is_default:
        # Si la nueva configuración es por defecto, desactivar otras configuraciones por defecto
        default_configs = db.query(DashboardConfig).filter(
            DashboardConfig.user_id == current_user.id,
            DashboardConfig.is_default == True
        ).all()
        for config in default_configs:
            config.is_default = False
            db.add(config)
    
    config = DashboardConfig(
        name=config_in.name,
        layout=config_in.layout,
        widgets=config_in.widgets,
        is_default=config_in.is_default,
        user_id=current_user.id
    )
    db.add(config)
    db.commit()
    db.refresh(config)
    return config

@router.get("/default", response_model=DashboardConfigSchema)
def read_default_dashboard_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get default dashboard configuration.
    """
    config = db.query(DashboardConfig).filter(
        DashboardConfig.user_id == current_user.id,
        DashboardConfig.is_default == True
    ).first()
    if not config:
        raise HTTPException(
            status_code=404,
            detail="No se encontró una configuración por defecto"
        )
    return config

@router.get("/{config_id}", response_model=DashboardConfigSchema)
def read_dashboard_config(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    config_id: int,
) -> Any:
    """
    Get specific dashboard configuration by ID.
    """
    config = db.query(DashboardConfig).filter(
        DashboardConfig.id == config_id,
        DashboardConfig.user_id == current_user.id
    ).first()
    if not config:
        raise HTTPException(
            status_code=404,
            detail="Configuración no encontrada"
        )
    return config

@router.put("/{config_id}", response_model=DashboardConfigSchema)
def update_dashboard_config(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    config_id: int,
    config_in: DashboardConfigUpdate,
) -> Any:
    """
    Update a dashboard configuration.
    """
    config = db.query(DashboardConfig).filter(
        DashboardConfig.id == config_id,
        DashboardConfig.user_id == current_user.id
    ).first()
    if not config:
        raise HTTPException(
            status_code=404,
            detail="Configuración no encontrada"
        )
    
    update_data = config_in.dict(exclude_unset=True)
    
    if "is_default" in update_data and update_data["is_default"]:
        # Si se está estableciendo como configuración por defecto
        default_configs = db.query(DashboardConfig).filter(
            DashboardConfig.user_id == current_user.id,
            DashboardConfig.is_default == True,
            DashboardConfig.id != config_id
        ).all()
        for other_config in default_configs:
            other_config.is_default = False
            db.add(other_config)
    
    for field, value in update_data.items():
        setattr(config, field, value)
    
    db.add(config)
    db.commit()
    db.refresh(config)
    return config

@router.delete("/{config_id}")
def delete_dashboard_config(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    config_id: int,
) -> Any:
    """
    Delete a dashboard configuration.
    """
    config = db.query(DashboardConfig).filter(
        DashboardConfig.id == config_id,
        DashboardConfig.user_id == current_user.id
    ).first()
    if not config:
        raise HTTPException(
            status_code=404,
            detail="Configuración no encontrada"
        )
    
    if config.is_default:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar la configuración por defecto"
        )
    
    db.delete(config)
    db.commit()
    return {"status": "success"} 