from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.report import ReportType
from .statistic import Statistic

class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: ReportType
    parameters: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[ReportType] = None
    parameters: Optional[str] = None

class Report(ReportBase):
    id: int
    user_id: int
    file_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    statistics: List[Statistic] = []

    class Config:
        from_attributes = True 