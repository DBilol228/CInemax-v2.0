from sqlalchemy import String, ForeignKey, text, Numeric, DateTime, Index
from decimal import Decimal
from datetime import datetime,timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Ticket(Base):
    __tablename__="tickets"
    __table_args__ = (
        Index(
            "unique_booked_seat",
            "showtime_id",
            "seat_id",
            unique=True,
            sqlite_where=text("status = 'booked'"),
        ),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"),index=True)
    showtime_id: Mapped[int] = mapped_column(ForeignKey("showtimes.id"),index=True)
    seat_id: Mapped[int] = mapped_column(ForeignKey("seats.id"),index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    status: Mapped[str] = mapped_column(String(20),default="booked")
    booked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),default=None)
    user = relationship("User", back_populates="tickets")
    showtime = relationship("Showtime", back_populates="tickets")
    seat = relationship("Seat", back_populates="tickets")
