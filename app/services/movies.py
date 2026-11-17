from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.repositories.movies import get_movie, save_movie
from app.schemas.movie import MovieCreate, MovieUpdate

def find_movie(db: Session, movie_id: int):
    movie = get_movie(db, movie_id)
    if movie is None:
        raise HTTPException(status_code=404,detail="Movie not found")
    return movie

def create_movie(db: Session, data: MovieCreate):
    movie = Movie(**data.model_dump())
    return save_movie(db, movie)

def update_movie(db: Session, movie_id: int, data: MovieUpdate):
    movie = find_movie(db, movie_id)
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        if value is None:
            raise HTTPException(status_code=422,detail=f"{field} cannot be null")
        setattr(movie, field, value)
    return save_movie(db, movie)

def deactivate_movie(db: Session, movie_id: int):
    movie = find_movie(db, movie_id)
    movie.is_active = False
    save_movie(db, movie)