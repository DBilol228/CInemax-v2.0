from pydantic import BaseModel, ConfigDict, Field

class CinemaHallCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    capacity: int = Field(gt=0)

class CinemaHallUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    capacity: int | None = Field(default=None, gt=0)
    is_active: bool | None = None

class CinemaHallResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    capacity: int
    is_active: bool