from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.ticket import Ticket

def get_ticket(db: Session, ticket_id: int):
    return db.get(Ticket, ticket_id)

def get_tickets(
    db: Session,
    user_id,
    showtime_id,
    status,
    page,
    page_size
):
    statement = select(Ticket)
    if user_id is not None:
        statement = statement.where(Ticket.user_id == user_id)
    if showtime_id is not None:
        statement = statement.where(Ticket.showtime_id == showtime_id)
    if status is not None:
        statement = statement.where(Ticket.status == status)
    total = db.scalar(select(func.count()).select_from(statement.subquery()))
    tickets = db.scalars(
        statement
        .order_by(Ticket.booked_at.desc(), Ticket.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return {
        "items": tickets,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

def save_ticket(db: Session, ticket: Ticket):
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket