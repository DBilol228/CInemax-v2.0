from typing import Literal

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.auth.permissions import require_manager
from app.db.database import get_db
from app.models.user import User
from app.repositories.movies import get_movies
from app.schemas.movie import *
from app.services.movies import *

router = APIRouter(prefix="/api/v1/movies",tags=["Movies"])

@router.get("", response_model=MovieListResponse)
def list_movies(
    search: str | None = None,
    genre: str | None = None,
    age_rating: str | None = None,
    is_active: bool | None = True,
    sort: Literal["id", "-id", "title", "-title"] = "id",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    movies, total = get_movies(db,search,genre,age_rating,is_active,sort,page,page_size)
    return {
        "items": movies,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

@router.get("/{movie_id}", response_model=MovieResponse)
def movie_details(movie_id: int,db: Session = Depends(get_db)):
    return find_movie(db, movie_id)

@router.post("", response_model=MovieResponse, status_code=201)
def add_movie(
    data: MovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    return create_movie(db, data)

@router.patch("/{movie_id}", response_model=MovieResponse)
def edit_movie(
    movie_id: int,
    data: MovieUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    return update_movie(db, movie_id, data)

@router.delete("/{movie_id}", status_code=204)
def delete_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    deactivate_movie(db, movie_id)
    return Response(status_code=204)