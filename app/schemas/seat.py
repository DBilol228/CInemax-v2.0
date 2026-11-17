from pydantic import BaseModel, ConfigDict, Field
from typing import Literal

class SeatCreate(BaseModel):
    row_number: int = Field(gt=0)
    seat_number: int = Field(gt=0)

class SeatUpdate(BaseModel):
    row_number: int | None = Field(default=None, gt=0)
    seat_number: int | None = Field(default=None, gt=0)
    is_active: bool | None = None

class SeatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    hall_id: int
    row_number: int
    seat_number: int
    is_active: bool


class SeatAvailabilityResponse(BaseModel):
    id: int
    row_number: int
    seat_number: int
    status: Literal["available", "booked", "unavailable"]

class SeatRowResponse(BaseModel):
    row_number: int
    seats: list[SeatAvailabilityResponse]

class SeatMapSummary(BaseModel):
    total: int
    available: int
    booked: int
    unavailable: int

class SeatMapResponse(BaseModel):
    showtime_id: int
    hall_id: int
    hall_name: str
    summary: SeatMapSummary
    rows: list[SeatRowResponse]