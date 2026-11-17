from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column,relationship
from app.db.database import Base

class User(Base):
    __tablename__="users"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255),unique=True,index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20),default="Customer")
    is_active: Mapped[bool] = mapped_column(Boolean,default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))
    tickets = relationship("Ticket", back_populates="user")