from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.permissions import require_manager
from app.db.database import get_db
from app.models.user import User
from app.repositories.seats import get_hall_seats
from app.schemas.seat import SeatCreate, SeatUpdate, SeatResponse
from app.services.cinema_halls import find_hall
from app.services.seats import create_seat, update_seat

router = APIRouter(prefix="/api/v1",tags=["Seats"])

@router.get("/halls/{hall_id}/seats",response_model=list[SeatResponse])
def list_seats(
    hall_id: int,
    db: Session = Depends(get_db)
):
    find_hall(db, hall_id)
    return get_hall_seats(db, hall_id)

@router.post(
    "/halls/{hall_id}/seats",
    response_model=SeatResponse,
    status_code=201
)
def add_seat(
    hall_id: int,
    data: SeatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    return create_seat(db, hall_id, data)

@router.patch("/seats/{seat_id}", response_model=SeatResponse)
def edit_seat(
    seat_id: int,
    data: SeatUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    return update_seat(db, seat_id, data)