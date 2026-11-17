from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Movie(Base):
    __tablename__="movies"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    duration_minutes: Mapped[int] = mapped_column(Integer)
    genre: Mapped[str] = mapped_column(String(500))
    age_rating: Mapped[str] = mapped_column(String(10))
    is_active: Mapped[bool] = mapped_column(Boolean,default=True)
    showtimes = relationship("Showtime", back_populates="movie")