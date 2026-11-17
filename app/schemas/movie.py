from pydantic import BaseModel, EmailStr, Field, ConfigDict

class MovieCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str
    duration_minutes: int = Field(gt=0)
    genre: str = Field(min_length=1,max_length=500)
    age_rating: str = Field(min_length=1, max_length=10)

class MovieUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    duration_minutes: int | None = Field(default=None, gt=0)
    genre: str | None = Field(default=None, min_length=1,max_length=500)
    age_rating: str | None = Field(default=None, min_length=1, max_length=10)
    is_active: bool | None = None

class MovieResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    duration_minutes: int
    genre: str
    age_rating: str
    is_active: bool

class MovieListResponse(BaseModel):
    items: list[MovieResponse]
    total: int
    page: int
    page_size: int
    total_pages: int