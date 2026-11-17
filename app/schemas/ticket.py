from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from decimal import Decimal
from typing import Literal
from app.core.dates import UTCDateTime

class TicketCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    showtime_id: int = Field(gt=0)
    seat_id: int = Field(gt=0)

class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    showtime_id: int
    seat_id: int
    price: Decimal
    status: Literal["booked", "cancelled"]
    booked_at: UTCDateTime
    cancelled_at: UTCDateTime | None

class TicketListResponse(BaseModel):
    items: list[TicketResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
