from pydantic import BaseModel, AwareDatetime, ConfigDict, Field
from datetime import datetime
from decimal import Decimal
from typing import Literal
from app.core.dates import UTCDateTime

class ShowtimeCreate(BaseModel):
    movie_id: int = Field(gt=0)
    hall_id: int = Field(gt=0)
    starts_at: AwareDatetime
    ticket_price: Decimal = Field(gt=0,max_digits=10,decimal_places=2)

class ShowtimeUpdate(BaseModel):
    movie_id: int | None = Field(default=None,gt=0)
    hall_id: int | None = Field(default=None,gt=0)
    starts_at: AwareDatetime| None = None
    ticket_price: Decimal | None = Field(default=None,gt=0,max_digits=10,decimal_places=2)
    status: Literal["scheduled","completed","cancelled"] | None = None

class ShowtimeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    movie_id: int
    hall_id: int
    starts_at: UTCDateTime
    ends_at: UTCDateTime
    ticket_price: Decimal
    status: Literal["scheduled","completed","cancelled"]

class ShowtimeListResponse(BaseModel):
    items: list[ShowtimeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
