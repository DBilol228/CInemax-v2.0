from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone

import jwt
import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.models import Seat, Showtime, Ticket, User


def book(cinema, user="customer", seat=None, show=None):
    return cinema["client"].post(
        "/api/v1/tickets",
        headers=cinema["headers"][user],
        json={"showtime_id": show or cinema["show"],
              "seat_id": seat or cinema["seat"]},
    )


def test_registration_login_and_profile(cinema):
    client = cinema["client"]
    response = client.post("/api/v1/auth/register", json={
        "full_name": "New user", "email": "NEW@example.com",
        "password": "password123",
    })
    assert response.status_code == 201
    assert response.json()["role"] == "Customer"
    assert "password_hash" not in response.json()
    assert response.json()["created_at"].endswith("Z")
    login = client.post("/api/v1/auth/login", data={
        "username": "new@example.com", "password": "password123",
    })
    assert login.status_code == 200
    headers = {"Authorization": "Bearer " + login.json()["access_token"]}
    assert client.get("/api/v1/users/me", headers=headers).status_code == 200
    assert client.patch("/api/v1/users/me", headers=headers,
                        json={"full_name": "Updated"}).json()["full_name"] == "Updated"
    assert client.patch("/api/v1/users/me", headers=headers,
                        json={"email": None}).status_code == 422


def test_permissions_and_user_list(cinema):
    client = cinema["client"]
    assert client.get("/api/v1/users/me").status_code == 401
    assert client.get("/api/v1/users", headers=cinema["headers"]["customer"]).status_code == 403
    response = client.get("/api/v1/users?search=Customer&page_size=1",
                          headers=cinema["headers"]["admin"])
    assert response.status_code == 200
    assert response.json()["total"] == 2
    assert len(response.json()["items"]) == 1
    assert response.json()["total_pages"] == 2
    assert client.get("/api/v1/auth").status_code == 404
    assert client.post("/api/v1/showtimes", headers=cinema["headers"]["customer"],
                       json={"movie_id": cinema["movie"], "hall_id": cinema["hall"],
                             "starts_at": cinema["start"].isoformat() + "Z",
                             "ticket_price": "50.00"}).status_code == 403
    assert client.post("/api/v1/movies", headers=cinema["headers"]["manager"],
                       json={"title": "Manager movie", "description": "Test",
                             "duration_minutes": 60, "genre": "Drama",
                             "age_rating": "12+"}).status_code == 201


def test_expired_invalid_and_inactive_tokens(cinema):
    client = cinema["client"]
    token = jwt.encode({"sub": "1", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
                       settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    for value in [token, "invalid-token"]:
        assert client.get("/api/v1/users/me", headers={
            "Authorization": "Bearer " + value,
        }).status_code == 401
    with cinema["sessions"]() as db:
        user = db.scalar(select(User).where(User.email == "customer@example.com"))
        user.is_active = False
        db.commit()
    assert client.get("/api/v1/users/me", headers=cinema["headers"]["customer"]).status_code == 401
    assert client.post("/api/v1/auth/login", data={
        "username": "customer@example.com", "password": "password123",
    }).status_code == 401


def test_booking_ownership_cancellation_and_rebooking(cinema):
    client = cinema["client"]
    response = book(cinema)
    assert response.status_code == 201
    ticket = response.json()
    assert ticket["status"] == "booked"
    assert ticket["price"] == "50.00"
    assert book(cinema).status_code == 409
    url = f"/api/v1/tickets/{ticket['id']}"
    assert client.get(url, headers=cinema["headers"]["other"]).status_code == 403
    assert client.post(url + "/cancel", headers=cinema["headers"]["manager"]).status_code == 403
    assert client.patch(f"/api/v1/showtimes/{cinema['show']}",
                        headers=cinema["headers"]["admin"],
                        json={"ticket_price": "65.00"}).status_code == 200
    assert client.get(url, headers=cinema["headers"]["customer"]).json()["price"] == "50.00"
    cancelled = client.post(url + "/cancel", headers=cinema["headers"]["customer"])
    assert cancelled.json()["status"] == "cancelled"
    assert cancelled.json()["cancelled_at"].endswith("Z")
    assert book(cinema).json()["price"] == "65.00"


def test_wrong_hall_inactive_seat_and_started_show(cinema):
    assert book(cinema, seat=cinema["foreign_seat"]).status_code == 400
    assert book(cinema, seat=cinema["inactive_seat"]).status_code == 409
    ticket = book(cinema).json()
    with cinema["sessions"]() as db:
        show = db.get(Showtime, cinema["show"])
        show.starts_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(minutes=1)
        db.commit()
    assert book(cinema).status_code == 409
    assert cinema["client"].post(f"/api/v1/tickets/{ticket['id']}/cancel",
                                headers=cinema["headers"]["customer"]).status_code == 409


def test_seat_map_sorting_and_statuses(cinema):
    client = cinema["client"]
    url = f"/api/v1/showtimes/{cinema['show']}/seats"
    data = client.get(url).json()
    assert data["summary"] == {"total": 3, "available": 2, "booked": 0, "unavailable": 1}
    assert [row["row_number"] for row in data["rows"]] == [1, 2]
    assert [seat["seat_number"] for seat in data["rows"][0]["seats"]] == [1, 2]
    assert book(cinema, show=cinema["second"]).status_code == 201
    assert client.get(url).json()["summary"]["booked"] == 0
    ticket = book(cinema).json()
    assert client.get(url).json()["summary"]["booked"] == 1
    client.post(f"/api/v1/tickets/{ticket['id']}/cancel", headers=cinema["headers"]["customer"])
    assert client.get(url).json()["summary"]["available"] == 2
    assert client.get(f"/api/v1/showtimes/{cinema['empty_show']}/seats").json()["rows"] == []
    assert client.get("/api/v1/showtimes/999999/seats").status_code == 404


def test_seat_history_and_capacity(cinema):
    client = cinema["client"]
    headers = cinema["headers"]["admin"]
    assert book(cinema).status_code == 201
    assert client.patch(f"/api/v1/seats/{cinema['seat']}", headers=headers,
                        json={"row_number": 9}).status_code == 409
    assert client.patch(f"/api/v1/halls/{cinema['hall']}", headers=headers,
                        json={"capacity": 2}).status_code == 409
    url = f"/api/v1/halls/{cinema['hall']}/seats"
    assert client.post(url, headers=headers, json={"row_number": 2, "seat_number": 1}).status_code == 409
    assert client.post(url, headers=headers, json={"row_number": 3, "seat_number": 1}).status_code == 201
    assert client.post(url, headers=headers, json={"row_number": 3, "seat_number": 2}).status_code == 409


def test_showtime_overlap_boundary_filters_and_history(cinema):
    client = cinema["client"]
    headers = cinema["headers"]["admin"]
    data = {"movie_id": cinema["movie"], "hall_id": cinema["hall"],
            "starts_at": cinema["start"].isoformat() + "Z", "ticket_price": "50.00"}
    assert client.post("/api/v1/showtimes", headers=headers, json=data).status_code == 409
    data["starts_at"] = (cinema["start"] + timedelta(minutes=90)).isoformat() + "Z"
    assert client.post("/api/v1/showtimes", headers=headers, json=data).status_code == 201
    result = client.get(f"/api/v1/showtimes?hall_id={cinema['hall']}&page_size=1").json()
    assert result["total"] == 3
    assert result["total_pages"] == 3
    assert result["items"][0]["starts_at"].endswith("Z")
    assert book(cinema).status_code == 201
    assert client.patch(f"/api/v1/showtimes/{cinema['show']}", headers=headers,
                        json={"hall_id": cinema["other_hall"]}).status_code == 409


def test_parallel_bookings(cinema):
    with ThreadPoolExecutor(max_workers=2) as pool:
        responses = list(pool.map(lambda user: book(cinema, user), ["customer", "other"]))
    assert sorted(response.status_code for response in responses) == [201, 409]
    with cinema["sessions"]() as db:
        tickets = db.scalars(select(Ticket).where(Ticket.status == "booked")).all()
        assert len(tickets) == 1


def test_parallel_booking_and_showtime_cancellation(cinema):
    def cancel():
        return cinema["client"].delete(f"/api/v1/showtimes/{cinema['show']}",
                                       headers=cinema["headers"]["admin"])

    with ThreadPoolExecutor(max_workers=2) as pool:
        booking = pool.submit(book, cinema)
        cancellation = pool.submit(cancel)
        assert booking.result().status_code in (201, 409)
        assert cancellation.result().status_code == 204
    with cinema["sessions"]() as db:
        assert db.get(Showtime, cinema["show"]).status == "cancelled"
        assert db.scalar(select(Ticket.id).where(
            Ticket.showtime_id == cinema["show"], Ticket.status == "booked",
        )) is None


def test_parallel_overlapping_showtimes(cinema):
    data = {"movie_id": cinema["movie"], "hall_id": cinema["other_hall"],
            "starts_at": cinema["start"].isoformat() + "Z", "ticket_price": "50.00"}

    def create():
        return cinema["client"].post("/api/v1/showtimes", json=data,
                                     headers=cinema["headers"]["admin"])

    with ThreadPoolExecutor(max_workers=2) as pool:
        responses = list(pool.map(lambda _: create(), range(2)))
    assert sorted(response.status_code for response in responses) == [201, 409]


def test_database_constraints(cinema):
    with cinema["sessions"]() as db:
        assert db.scalar(text("PRAGMA foreign_keys")) == 1
        db.add(Seat(hall_id=cinema["hall"], row_number=2, seat_number=1))
        with pytest.raises(IntegrityError):
            db.commit()
        db.rollback()
        db.add(Seat(hall_id=999999, row_number=1, seat_number=1))
        with pytest.raises(IntegrityError):
            db.commit()


def test_parallel_seat_creation_respects_capacity(cinema):
    def create(number):
        return cinema["client"].post(
            f"/api/v1/halls/{cinema['hall']}/seats",
            headers=cinema["headers"]["admin"],
            json={"row_number": 3, "seat_number": number},
        )

    with ThreadPoolExecutor(max_workers=2) as pool:
        responses = list(pool.map(create, [1, 2]))
    assert sorted(response.status_code for response in responses) == [201, 409]


def test_parallel_booking_and_rescheduling(cinema):
    def reschedule():
        return cinema["client"].patch(
            f"/api/v1/showtimes/{cinema['show']}",
            headers=cinema["headers"]["admin"],
            json={"hall_id": cinema["other_hall"]},
        )

    with ThreadPoolExecutor(max_workers=2) as pool:
        booking = pool.submit(book, cinema)
        scheduling = pool.submit(reschedule)
        assert booking.result().status_code in (201, 400)
        assert scheduling.result().status_code in (200, 409)
    with cinema["sessions"]() as db:
        show = db.get(Showtime, cinema["show"])
        for ticket in db.scalars(select(Ticket).where(Ticket.showtime_id == show.id)):
            assert db.get(Seat, ticket.seat_id).hall_id == show.hall_id


def test_migrations_match_models_and_can_be_reversed(cinema):
    config = Config("alembic.ini")
    command.check(config)
    command.downgrade(config, "09edc8d8f9e0")
    command.upgrade(config, "head")
    command.check(config)
