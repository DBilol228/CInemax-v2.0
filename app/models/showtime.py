from sqlalchemy import String, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from datetime import datetime
from decimal import Decimal

class Showtime(Base):
    __tablename__="showtimes"
    id: Mapped[int] = mapped_column(primary_key=True)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"),index=True)
    hall_id: Mapped[int] = mapped_column(ForeignKey("cinema_halls.id"),index=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),index=True)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(20),default="scheduled")
    ticket_price: Mapped[Decimal] = mapped_column(Numeric(10,2))
    movie = relationship("Movie", back_populates="showtimes")
    hall = relationship("CinemaHall", back_populates="showtimes")
    tickets = relationship("Ticket", back_populates="showtime")