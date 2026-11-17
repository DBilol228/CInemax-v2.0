from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from typing import Literal
from app.core.dates import UTCDateTime

class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None,min_length=1, max_length=100)
    email: EmailStr | None = None

class UserRoleUpdate(BaseModel):
    role: Literal["Admin","CinemaManager","Customer"]

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: UTCDateTime

class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
