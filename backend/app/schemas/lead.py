from datetime import datetime
from pydantic import BaseModel, Field

class LeadBase(BaseModel):
    title: str
    description: str | None = None
    source: str | None = None
    status: str | None = 'new'
    value: float | None = 0
    assigned_to: int | None = None
    customer_id: int | None = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(LeadBase):
    pass

class LeadRead(LeadBase):
    id: int
    converted_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
