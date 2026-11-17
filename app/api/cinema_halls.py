from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.permissions import require_manager
from app.db.database import get_db
from app.models.user import User
from app.repositories.cinema_halls import get_halls
from app.schemas.cinema_hall import *
from app.services.cinema_halls import create_hall, update_hall

router = APIRouter(prefix="/api/v1/halls",tags=["Cinema halls"])

@router.get("", response_model=list[CinemaHallResponse])
def list_halls(db: Session = Depends(get_db)):
    return get_halls(db)

@router.post(
    "",
    response_model=CinemaHallResponse,
    status_code=201
)
def add_hall(
    data: CinemaHallCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    return create_hall(db, data)

@router.patch("/{hall_id}", response_model=CinemaHallResponse)
def edit_hall(
    hall_id: int,
    data: CinemaHallUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    return update_hall(db, hall_id, data)