from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.movie import Movie

def get_movie(db: Session, movie_id: int):
    return db.get(Movie, movie_id)

def get_movies(db: Session,search,genre,age_rating,is_active,sort,page,page_size):
    statement = select(Movie)
    if search:
        statement = statement.where(Movie.title.ilike(f"%{search}%"))
    if genre:
        statement = statement.where(Movie.genre == genre)
    if age_rating:
        statement = statement.where(Movie.age_rating == age_rating)
    if is_active is not None:
        statement = statement.where(Movie.is_active == is_active)
    total = db.scalar(select(func.count()).select_from(statement.subquery()))
    sorting = {
        "id": Movie.id.asc(),
        "-id": Movie.id.desc(),
        "title": Movie.title.asc(),
        "-title": Movie.title.desc()
    }

    movies = db.scalars(
        statement.order_by(sorting[sort], Movie.id).offset((page - 1) * page_size).limit(page_size)
    ).all()
    return movies, total

def save_movie(db: Session, movie: Movie):
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie