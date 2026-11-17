from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session
from app.models.showtime import Showtime

from app.models.cinema_hall import CinemaHall
from app.models.seat import Seat
from app.models.ticket import Ticket

def find_overlap(db: Session, hall_id, starts_at, ends_at):
    return db.scalar(
        select(Showtime).where(
            Showtime.hall_id == hall_id,
            Showtime.status == "scheduled",
            Showtime.starts_at < ends_at,
            Showtime.ends_at > starts_at
        )
    )

def save_showtime(db: Session, showtime: Showtime):
    db.add(showtime)
    db.commit()
    db.refresh(showtime)
    return showtime

def get_showtime(db: Session, showtime_id: int):
    return db.get(Showtime, showtime_id)

def get_showtimes(db: Session,movie_id,hall_id,date_from,date_to,status,page,page_size):
    statement = select(Showtime)
    if movie_id is not None:
        statement = statement.where(Showtime.movie_id == movie_id)
    if hall_id is not None:
        statement = statement.where(Showtime.hall_id == hall_id)
    if date_from is not None:
        statement = statement.where(Showtime.starts_at >= date_from)
    if date_to is not None:
        statement = statement.where(Showtime.starts_at <= date_to)
    if status is not None:
        statement = statement.where(Showtime.status == status)
    total = db.scalar(select(func.count()).select_from(statement.subquery()))
    showtimes = db.scalars(
        statement
        .order_by(Showtime.starts_at, Showtime.id)
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return showtimes, total

def get_seat_map_data(db: Session, showtime_id: int):
    screening = db.execute(
        select(Showtime, CinemaHall)
        .join(CinemaHall, Showtime.hall_id == CinemaHall.id)
        .where(Showtime.id == showtime_id)
    ).first()
    if screening is None:
        return None
    showtime, hall = screening
    seats = db.execute(
        select(Seat, Ticket.id)
        .outerjoin(
            Ticket,
            and_(
                Ticket.seat_id == Seat.id,
                Ticket.showtime_id == showtime.id,
                Ticket.status == "booked",
            ),
        )
        .where(Seat.hall_id == hall.id)
        .order_by(Seat.row_number, Seat.seat_number)
    ).all()
    return showtime, hall, seats