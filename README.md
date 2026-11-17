# Cinemax API

FastAPI learning project with JWT authentication, roles, movies, halls,
seats, showtimes, booking, and a public seat map.

This version uses SQLite, as chosen for learning. The original assignment
requires PostgreSQL, so this is a documented difference from that requirement.

## Setup (PowerShell, Python 3.11+)

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If `.venv` already works, activate it without recreating it.
Copy `.env.example` to `.env` only if you do not already have `.env`.
Generate a secret and put it in `.env` as `SECRET_KEY`:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

From the project root, apply the existing migrations and start the API:

```powershell
alembic upgrade head
uvicorn app.main:app --reload
```

The booking-constraints migration is already included. Do not generate another
migration for the same constraints. Existing duplicate seats or active bookings
must be resolved before upgrading; the migration does not delete records.

## Using the API

Open http://127.0.0.1:8000 for the frontend. No Node installation or separate
frontend server is needed. The page uses plain HTML, CSS, and JavaScript.
The frontend includes film browsing, showtimes, interactive seat selection,
registration/login, ticket cancellation, profile editing, and a management
Studio for adding movies, halls, seats, screenings, and assigning user roles.

Use the header controls to switch English/Russian and dark/light themes.
These preferences are saved locally. Access tokens are kept in sessionStorage
for the current browser tab; no password is stored. Curtain transitions respect
the system's reduced-motion preference. Prices are displayed in TJS.
Movie titles/descriptions remain the original catalog content when switching
languages. The bundled SVG artwork is decorative, not official movie posters.

API documentation is still available at http://127.0.0.1:8000/docs. Its login
form uses the field `username` for the email. Registration always creates a Customer.

To promote a registered account locally:

```powershell
python -m app.create_admin
```

Admins can assign CinemaManager roles. Managers and admins manage the catalog
and schedule; customers book seats and view/cancel their own tickets.
Cancelling a showtime also cancels its booked tickets in the same transaction.
Seat renumbering and showtime rescheduling are blocked when ticket history exists.

Dates are normalized to UTC before saving in SQLite. SQLite does not retain
timezone metadata; response schemas restore the UTC timezone in API responses.

SQLite foreign keys are enabled. Write requests acquire `BEGIN IMMEDIATE`
before reading data and validating business rules. This serializes writers
across processes using the same SQLite database file. A busy database returns
409 so clients can retry. Keep write requests short. Direct database scripts
must use equivalent transactions if they run alongside the API.

A partial unique index additionally prevents duplicate booked tickets while
allowing cancelled tickets to remain in history and seats to be sold again.

## Tests

```powershell
python -m pytest -q
```

Tests use separate temporary databases created through Alembic migrations.
They do not modify `cinemax.db`. Coverage includes authentication, permissions,
pagination, scheduling, seat maps, ticket history, and concurrent requests.

Optional frontend rendering/state checks, if Node is installed:

```powershell
node tests/frontend_smoke.mjs
```

These checks exercise both languages, filters, login, booking, cancellation,
saved preferences, and curtain transitions with a mock DOM/API. They do not
replace visual browser testing. Node is not needed to run the website itself.
# Cinemax v2.0
