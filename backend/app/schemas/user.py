from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class RoleBase(BaseModel):
    name: str
    description: str | None = None

class RoleRead(RoleBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role_id: int

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    role: RoleRead

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class TokenPayload(BaseModel):
    sub: str | None = None
