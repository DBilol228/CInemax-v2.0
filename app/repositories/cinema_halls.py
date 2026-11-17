from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.cinema_hall import CinemaHall

def get_halls(db: Session):
    return db.scalars(
        select(CinemaHall).order_by(CinemaHall.id)
    ).all()

def get_hall(db: Session, hall_id: int):
    return db.get(CinemaHall, hall_id)

def save_hall(db: Session, hall: CinemaHall):
    db.add(hall)
    db.commit()
    db.refresh(hall)
    return hall