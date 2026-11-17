from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.seat import Seat

def get_hall_seats(db: Session, hall_id: int):
    return db.scalars(select(Seat).where(Seat.hall_id == hall_id).order_by(Seat.row_number, Seat.seat_number)
    ).all()

def get_seat(db: Session, seat_id: int):
    return db.get(Seat, seat_id)

def find_duplicate_seat(db: Session,hall_id: int,row_number: int,seat_number: int):
    return db.scalar(
        select(Seat).where(
            Seat.hall_id == hall_id,
            Seat.row_number == row_number,
            Seat.seat_number == seat_number
        )
    )

def save_seat(db: Session, seat: Seat):
    db.add(seat)
    db.commit()
    db.refresh(seat)
    return seat