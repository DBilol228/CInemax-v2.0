from sqlalchemy import Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Seat(Base):
    __tablename__="seats"
    __table_args__ = (
        UniqueConstraint(
            "hall_id",
            "row_number",
            "seat_number",
            name="unique_seat_in_hall",
        ),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    hall_id: Mapped[int] = mapped_column(ForeignKey("cinema_halls.id"),index=True)
    row_number: Mapped[int] = mapped_column()
    seat_number: Mapped[int] = mapped_column()
    is_active: Mapped[bool] = mapped_column(Boolean,default=True)
    hall = relationship("CinemaHall", back_populates="seats")
    tickets = relationship("Ticket", back_populates="seat")
