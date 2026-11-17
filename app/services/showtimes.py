from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session

from sqlalchemy import select, update

from app.models.ticket import Ticket
from app.models.movie import Movie
from app.models.cinema_hall import CinemaHall
from app.models.showtime import Showtime
from app.repositories.showtimes import find_overlap, save_showtime, get_showtime, get_seat_map_data
from app.schemas.showtime import ShowtimeCreate,ShowtimeUpdate

def create_showtime(db: Session, data: ShowtimeCreate):
    movie = db.get(Movie, data.movie_id)
    hall = db.get(CinemaHall, data.hall_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    if hall is None:
        raise HTTPException(status_code=404, detail="Hall not found")
    if not movie.is_active or not hall.is_active:
        raise HTTPException(status_code=409,detail="Movie or hall is inactive")
    starts_at = data.starts_at.astimezone(timezone.utc).replace(tzinfo=None)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if starts_at <= now:
        raise HTTPException(status_code=422,detail="Showtime must start in the future")
    ends_at = starts_at + timedelta(minutes=movie.duration_minutes)
    overlap = find_overlap(db, hall.id, starts_at, ends_at)
    if overlap:
        raise HTTPException(status_code=409,detail="Another showtime overlaps in this hall")
    showtime = Showtime(
        movie_id=movie.id,
        hall_id=hall.id,
        starts_at=starts_at,
        ends_at=ends_at,
        ticket_price=data.ticket_price,
        status="scheduled"
    )
    return save_showtime(db, showtime)

def find_showtime(db: Session, showtime_id: int):
    showtime = get_showtime(db, showtime_id)
    if showtime is None:
        raise HTTPException(status_code=404,detail="Showtime not found")
    return showtime

def update_showtime(
    db: Session,
    showtime_id: int,
    data: ShowtimeUpdate,
):
    showtime = find_showtime(db, showtime_id)
    changes = data.model_dump(exclude_unset=True)
    for field, value in changes.items():
        if value is None:
            raise HTTPException(
                status_code=422,
                detail=f"{field} cannot be null",
            )
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if showtime.status != "scheduled":
        raise HTTPException(
            status_code=409,
            detail="Only scheduled showtimes can be changed",
        )
    if not changes:
        return showtime
    new_status = changes.get("status", showtime.status)
    if new_status == "completed":
        if showtime.ends_at > now:
            raise HTTPException(
                status_code=409,
                detail="Showtime has not ended yet",
            )
        if set(changes) != {"status"}:
            raise HTTPException(
                status_code=409,
                detail="Complete the showtime without other changes",
            )
    elif showtime.starts_at <= now:
        raise HTTPException(
            status_code=409,
            detail="Showtime has already started",
        )
    schedule_fields = {"movie_id", "hall_id", "starts_at"}
    if schedule_fields.intersection(changes):
        existing_ticket = db.scalar(
            select(Ticket.id)
            .where(Ticket.showtime_id == showtime.id)
            .limit(1)
        )
        if existing_ticket is not None:
            raise HTTPException(
                status_code=409,
                detail="Cannot reschedule a showtime with ticket history",
            )
    movie_id = changes.get("movie_id", showtime.movie_id)
    hall_id = changes.get("hall_id", showtime.hall_id)
    starts_at = showtime.starts_at
    ends_at = showtime.ends_at
    if "starts_at" in changes:
        starts_at = changes["starts_at"].astimezone(
            timezone.utc
        ).replace(tzinfo=None)
    if schedule_fields.intersection(changes):
        movie = db.get(Movie, movie_id)
        hall = db.get(CinemaHall, hall_id)
        if movie is None or hall is None:
            raise HTTPException(
                status_code=404,
                detail="Movie or hall not found",
            )
        if not movie.is_active or not hall.is_active:
            raise HTTPException(
                status_code=409,
                detail="Movie or hall is inactive",
            )
        if starts_at <= now:
            raise HTTPException(
                status_code=422,
                detail="Showtime must start in the future",
            )
        ends_at = starts_at + timedelta(
            minutes=movie.duration_minutes
        )
    if new_status == "scheduled":
        overlap = db.scalar(
            select(Showtime).where(
                Showtime.id != showtime.id,
                Showtime.hall_id == hall_id,
                Showtime.status == "scheduled",
                Showtime.starts_at < ends_at,
                Showtime.ends_at > starts_at,
            )
        )
        if overlap:
            raise HTTPException(
                status_code=409,
                detail="Another showtime overlaps in this hall",
            )
    showtime.movie_id = movie_id
    showtime.hall_id = hall_id
    showtime.starts_at = starts_at
    showtime.ends_at = ends_at
    showtime.status = new_status
    if "ticket_price" in changes:
        showtime.ticket_price = changes["ticket_price"]
    if new_status == "cancelled":
        db.execute(
            update(Ticket)
            .where(
                Ticket.showtime_id == showtime.id,
                Ticket.status == "booked",
            )
            .values(
                status="cancelled",
                cancelled_at=now,
            )
        )
    return save_showtime(db, showtime)

def build_seat_map(db: Session, showtime_id: int):
    result = get_seat_map_data(db, showtime_id)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Showtime not found",
        )
    showtime, hall, seats = result
    summary = {
        "total": 0,
        "available": 0,
        "booked": 0,
        "unavailable": 0,
    }
    rows = {}
    for seat, ticket_id in seats:
        if not seat.is_active:
            status = "unavailable"
        elif ticket_id is not None:
            status = "booked"
        else:
            status = "available"
        summary["total"] += 1
        summary[status] += 1
        if seat.row_number not in rows:
            rows[seat.row_number] = {
                "row_number": seat.row_number,
                "seats": [],
            }
        rows[seat.row_number]["seats"].append({
            "id": seat.id,
            "row_number": seat.row_number,
            "seat_number": seat.seat_number,
            "status": status,
        })
    return {
        "showtime_id": showtime.id,
        "hall_id": hall.id,
        "hall_name": hall.name,
        "summary": summary,
        "rows": list(rows.values())
    }