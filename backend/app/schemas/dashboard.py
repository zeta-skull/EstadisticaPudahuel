from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class DashboardConfigBase(BaseModel):
    name: str
    layout: Dict[str, Any]
    widgets: Dict[str, Any]
    is_default: bool = False

class DashboardConfigCreate(DashboardConfigBase):
    pass

class DashboardConfigUpdate(BaseModel):
    name: Optional[str] = None
    layout: Optional[Dict[str, Any]] = None
    widgets: Optional[Dict[str, Any]] = None
    is_default: Optional[bool] = None

class DashboardConfig(DashboardConfigBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 