from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.cinema_hall import CinemaHall
from app.models.seat import Seat
from app.repositories.cinema_halls import get_hall, save_hall
from app.schemas.cinema_hall import CinemaHallCreate, CinemaHallUpdate

def find_hall(db: Session, hall_id: int):
    hall = get_hall(db, hall_id)
    if hall is None:
        raise HTTPException(status_code=404,detail="Hall not found")
    return hall

def save_hall_safely(db: Session, hall: CinemaHall):
    try:
        return save_hall(db, hall)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,detail="Hall name already exists")

def create_hall(db: Session, data: CinemaHallCreate):
    hall = CinemaHall(**data.model_dump())
    return save_hall_safely(db, hall)

def update_hall(db: Session,hall_id: int,data: CinemaHallUpdate):
    hall = find_hall(db, hall_id)
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        if value is None:
            raise HTTPException(status_code=422,detail=f"{field} cannot be null")
    if "capacity" in updates:
        seat_count = db.scalar(select(func.count()).select_from(Seat).where(Seat.hall_id == hall_id))
        if updates["capacity"] < seat_count:
            raise HTTPException(status_code=409,detail="Capacity cannot be less than existing seat count")
    for field, value in updates.items():
        setattr(hall, field, value)
    return save_hall_safely(db, hall)