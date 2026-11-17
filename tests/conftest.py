from datetime import datetime, timedelta, timezone
import os

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

# Keep an unrelated host DEBUG environment value out of application settings.
os.environ["DEBUG"] = "false"

import app.models
from app.auth.security import create_access_token, hash_password
from app.core.config import settings
from app.db import database
from app.main import app
from app.models import CinemaHall, Movie, Seat, Showtime, User


@pytest.fixture
def cinema(tmp_path, monkeypatch):
    # Every test migrates a separate database. Never use cinemax.db for tests.
    url = "sqlite:///" + (tmp_path / "test.db").as_posix()
    monkeypatch.setattr(settings, "DATABASE_URL", url)
    command.upgrade(Config("alembic.ini"), "head")

    engine = create_engine(url, connect_args={"check_same_thread": False})
    event.listen(engine, "connect", database.enable_foreign_keys)
    sessions = sessionmaker(bind=engine)
    monkeypatch.setattr(database, "SessionLocal", sessions)

    with sessions() as db:
        password_hash = hash_password("password123")
        users = [
            User(full_name=role, email=f"{name}@example.com",
                 password_hash=password_hash, role=role)
            for name, role in [
                ("admin", "Admin"),
                ("manager", "CinemaManager"),
                ("customer", "Customer"),
                ("other", "Customer"),
            ]
        ]
        movie = Movie(title="Test movie", description="Description",
                      duration_minutes=90, genre="Drama", age_rating="12+")
        hall = CinemaHall(name="Hall A", capacity=4)
        other_hall = CinemaHall(name="Hall B", capacity=4)
        empty_hall = CinemaHall(name="Empty", capacity=4)
        db.add_all(users + [movie, hall, other_hall, empty_hall])
        db.flush()

        seats = [
            Seat(hall_id=hall.id, row_number=2, seat_number=1),
            Seat(hall_id=hall.id, row_number=1, seat_number=2),
            Seat(hall_id=hall.id, row_number=1, seat_number=1, is_active=False),
            Seat(hall_id=other_hall.id, row_number=1, seat_number=1),
        ]
        start = (datetime.now(timezone.utc) + timedelta(days=2)).replace(
            tzinfo=None, microsecond=0
        )
        show = Showtime(movie_id=movie.id, hall_id=hall.id,
                        starts_at=start, ends_at=start + timedelta(minutes=90),
                        ticket_price=50)
        second = Showtime(movie_id=movie.id, hall_id=hall.id,
                          starts_at=start + timedelta(hours=3),
                          ends_at=start + timedelta(hours=4, minutes=30),
                          ticket_price=50)
        empty_show = Showtime(movie_id=movie.id, hall_id=empty_hall.id,
                              starts_at=start, ends_at=start + timedelta(minutes=90),
                              ticket_price=50)
        db.add_all(seats + [show, second, empty_show])
        db.commit()

        data = {
            "sessions": sessions,
            "movie": movie.id,
            "hall": hall.id,
            "other_hall": other_hall.id,
            "show": show.id,
            "second": second.id,
            "empty_show": empty_show.id,
            "seat": seats[0].id,
            "inactive_seat": seats[2].id,
            "foreign_seat": seats[3].id,
            "start": start,
            "headers": {
                name: {"Authorization": "Bearer " + create_access_token(user.id)}
                for name, user in zip(
                    ["admin", "manager", "customer", "other"], users
                )
            },
        }

    with TestClient(app) as client:
        data["client"] = client
        yield data
    engine.dispose()
