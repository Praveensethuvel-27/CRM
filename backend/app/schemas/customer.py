from datetime import datetime
from pydantic import BaseModel

class CustomerBase(BaseModel):
    company_name: str
    industry: str | None = None
    address: str | None = None
    email: str | None = None
    phone: str | None = None
    owner_id: int | None = None
    status: str | None = 'active'

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    pass

class CustomerRead(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
