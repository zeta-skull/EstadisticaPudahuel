from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime

class StatisticBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    data: Dict[str, Any]
    source_file: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class StatisticCreate(StatisticBase):
    pass

class StatisticUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class Statistic(StatisticBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 