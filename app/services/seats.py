from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.cinema_hall import CinemaHall
from app.models.seat import Seat
from app.models.ticket import Ticket
from app.repositories.seats import *
from app.schemas.seat import SeatCreate, SeatUpdate

def save_seat_safely(db: Session, seat: Seat):
    try:
        return save_seat(db, seat)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,detail="Seat conflicts with existing data")

def create_seat(db: Session, hall_id: int, data: SeatCreate):
    hall = db.get(CinemaHall, hall_id)
    if hall is None:
        raise HTTPException(status_code=404, detail="Hall not found")
    if not hall.is_active:
        raise HTTPException(status_code=409, detail="Hall is inactive")
    duplicate = find_duplicate_seat(db, hall_id, data.row_number, data.seat_number)
    if duplicate:
        raise HTTPException(status_code=409,detail="Seat already exists in this hall")
    seats = get_hall_seats(db, hall_id)
    if len(seats) >= hall.capacity:
        raise HTTPException(status_code=409,detail="Hall capacity reached")
    seat = Seat(hall_id=hall_id, **data.model_dump())
    return save_seat_safely(db, seat)

def update_seat(db: Session, seat_id: int, data: SeatUpdate):
    seat = get_seat(db, seat_id)
    if seat is None:
        raise HTTPException(status_code=404, detail="Seat not found")
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        if value is None:
            raise HTTPException(status_code=422,detail=f"{field} cannot be null")
    row_number = updates.get("row_number", seat.row_number)
    seat_number = updates.get("seat_number", seat.seat_number)
    if row_number != seat.row_number or seat_number != seat.seat_number:
        ticket_id = db.scalar(
            select(Ticket.id).where(Ticket.seat_id == seat.id).limit(1)
        )
        if ticket_id is not None:
            raise HTTPException(
                status_code=409,
                detail="Cannot renumber a seat with ticket history",
            )
    duplicate = find_duplicate_seat(db, seat.hall_id, row_number, seat_number)
    if duplicate and duplicate.id != seat.id:
        raise HTTPException(status_code=409,detail="Seat already exists in this hall")
    for field, value in updates.items():
        setattr(seat, field, value)

    return save_seat_safely(db, seat)
