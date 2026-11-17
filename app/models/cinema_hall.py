from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped,mapped_column, relationship
from app.db.database import Base

class CinemaHall(Base):
    __tablename__="cinema_halls"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200),unique=True)
    capacity: Mapped[int] = mapped_column()
    is_active: Mapped[bool] = mapped_column(Boolean,default=True)
    seats = relationship("Seat", back_populates="hall")
    showtimes = relationship("Showtime", back_populates="hall")