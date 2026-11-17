from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.cinema_hall import CinemaHall
from app.models.movie import Movie
from app.models.seat import Seat
from app.models.ticket import Ticket
from app.repositories.tickets import get_ticket, save_ticket
from app.schemas.ticket import TicketCreate
from app.services.showtimes import find_showtime

def find_ticket(db: Session, ticket_id: int):
    ticket = get_ticket(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404,detail="Ticket not found")
    return ticket

def book_ticket(db: Session, user, data: TicketCreate):
    showtime = find_showtime(db, data.showtime_id)
    seat = db.get(Seat, data.seat_id)
    if seat is None:
        raise HTTPException(status_code=404,detail="Seat not found")
    if seat.hall_id != showtime.hall_id:
        raise HTTPException(status_code=400,detail="Seat belongs to another hall")
    hall = db.get(CinemaHall, showtime.hall_id)
    movie = db.get(Movie, showtime.movie_id)
    if hall is None or movie is None:
        raise HTTPException(status_code=409, detail="Showtime references missing data")
    if not seat.is_active or not hall.is_active or not movie.is_active:
        raise HTTPException(status_code=409,detail="Seat, hall, or movie is inactive")
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if showtime.status != "scheduled" or showtime.starts_at <= now:
        raise HTTPException(status_code=409,detail="Showtime is not available for booking")
    ticket = Ticket(
        user_id=user.id,
        showtime_id=showtime.id,
        seat_id=seat.id,
        price=showtime.ticket_price,
        status="booked"
    )
    try:
        return save_ticket(db, ticket)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,detail="Seat already booked")

def view_ticket(db: Session, ticket_id: int, user):
    ticket = find_ticket(db, ticket_id)
    if ticket.user_id != user.id:
        if user.role not in ("Admin", "CinemaManager"):
            raise HTTPException(status_code=403,detail="You cannot view another user's ticket")
    return ticket

def cancel_ticket(db: Session, ticket_id: int, user):
    ticket = find_ticket(db, ticket_id)
    if ticket.user_id != user.id and user.role != "Admin":
        raise HTTPException(status_code=403,detail="You cannot cancel another user's ticket")
    if ticket.status == "cancelled":
        return ticket
    showtime = find_showtime(db, ticket.showtime_id)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if showtime.starts_at <= now:
        raise HTTPException(status_code=409,detail="Showtime has already started")
    ticket.status = "cancelled"
    ticket.cancelled_at = now
    return save_ticket(db, ticket)
