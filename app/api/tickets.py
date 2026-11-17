from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.permissions import require_customer, require_manager
from app.db.database import get_db
from app.models.user import User
from app.repositories.tickets import get_tickets
from app.schemas.ticket import *
from app.services.tickets import *

router = APIRouter(prefix="/api/v1/tickets",tags=["Tickets"])


@router.post("", response_model=TicketResponse, status_code=201)
def add_ticket(
    data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer)
):
    return book_ticket(db, current_user, data)

@router.get("/my", response_model=TicketListResponse)
def my_tickets(
    status: Literal["booked", "cancelled"] | None = None,
    showtime_id: int | None = Query(default=None, gt=0),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer)
):
    return get_tickets(
        db,
        current_user.id,
        showtime_id,
        status,
        page,
        page_size
    )

@router.get("", response_model=TicketListResponse)
def list_tickets(
    user_id: int | None = Query(default=None, gt=0),
    showtime_id: int | None = Query(default=None, gt=0),
    status: Literal["booked", "cancelled"] | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    return get_tickets(
        db,
        user_id,
        showtime_id,
        status,
        page,
        page_size
    )

@router.get("/{ticket_id}", response_model=TicketResponse)
def ticket_details(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return view_ticket(db, ticket_id, current_user)

@router.post("/{ticket_id}/cancel", response_model=TicketResponse)
def cancel_my_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return cancel_ticket(db, ticket_id, current_user)