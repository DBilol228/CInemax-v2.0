from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.schemas.seat import SeatMapResponse
from app.services.showtimes import build_seat_map
from app.auth.permissions import require_manager
from app.db.database import get_db
from app.models.user import User
from app.schemas.showtime import *
from app.services.showtimes import *

from datetime import timezone
from typing import Literal
from pydantic import AwareDatetime
from app.repositories.showtimes import get_showtimes

router = APIRouter(prefix="/api/v1/showtimes",tags=["Showtimes"])

@router.post("", response_model=ShowtimeResponse, status_code=201)
def add_showtime(
    data: ShowtimeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    return create_showtime(db,data)

@router.get("", response_model=ShowtimeListResponse)
def list_showtimes(
    movie_id: int | None = Query(default=None, gt=0),
    hall_id: int | None = Query(default=None, gt=0),
    date_from: AwareDatetime | None = None,
    date_to: AwareDatetime | None = None,
    status: Literal["scheduled", "completed", "cancelled"] | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    if date_from is not None:
        date_from = date_from.astimezone(timezone.utc).replace(
            tzinfo=None
        )
    if date_to is not None:
        date_to = date_to.astimezone(timezone.utc).replace(
            tzinfo=None
        )
    if date_from is not None and date_to is not None:
        if date_from > date_to:
            raise HTTPException(status_code=422,detail="date_from must not be after date_to")
    showtimes, total = get_showtimes(
        db,
        movie_id,
        hall_id,
        date_from,
        date_to,
        status,
        page,
        page_size
)
    return {
        "items": showtimes,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

@router.get("/{showtime_id}", response_model=ShowtimeResponse)
def showtime_details(
    showtime_id: int,
    db: Session = Depends(get_db)
):
    return find_showtime(db, showtime_id)
@router.patch("/{showtime_id}",response_model=ShowtimeResponse)
def edit_showtime(
    showtime_id: int,
    data: ShowtimeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    return update_showtime(db, showtime_id, data)

@router.delete("/{showtime_id}", status_code=204)
def cancel_showtime(
    showtime_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    data = ShowtimeUpdate(status="cancelled")
    update_showtime(db, showtime_id, data)
    return Response(status_code=204)

@router.get("/{showtime_id}/seats",response_model=SeatMapResponse)
def showtime_seats(showtime_id: int,db: Session = Depends(get_db)):
    return build_seat_map(db, showtime_id)