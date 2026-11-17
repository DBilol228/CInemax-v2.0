from fastapi import FastAPI
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.movies import router as movies_router
from app.api.cinema_halls import router as halls_router
from app.api.seats import router as seats_router
from app.api.showtimes import router as showtimes_router
from app.api.tickets import router as tickets_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    responses={
        400: {"description": "Invalid request"},
        401: {"description": "Missing, invalid, or expired credentials"},
        403: {"description": "Permission denied"},
        404: {"description": "Resource not found"},
        409: {"description": "Conflict with existing data or resource state"},
        422: {"description": "Validation error"},
    },
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(movies_router)
app.include_router(halls_router)
app.include_router(seats_router)
app.include_router(showtimes_router)
app.include_router(tickets_router)

# Serve the frontend from the same server as the API.
STATIC_DIR = Path(__file__).resolve().parent / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", include_in_schema=False)
def frontend():
    return FileResponse(STATIC_DIR / "index.html")
