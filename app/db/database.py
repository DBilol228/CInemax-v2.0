import sqlite3

from fastapi import HTTPException, Request
from sqlalchemy import create_engine, event, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine)


@event.listens_for(engine, "connect")
def enable_foreign_keys(connection, connection_record):
    cursor = connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

class Base(DeclarativeBase):
    pass

def get_db(request: Request):
    db = SessionLocal()
    try:
        # SQLite allows one writer. Lock before reading booking/schedule data,
        # so another write request cannot change it between checking and saving.
        if request.method in ("POST", "PATCH", "PUT", "DELETE"):
            db.execute(text("BEGIN IMMEDIATE"))
        yield db
    except OperationalError as error:
        db.rollback()
        error_code = getattr(error.orig, "sqlite_errorcode", 0) or 0
        if (error_code & 255) in (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED):
            raise HTTPException(
                status_code=409,
                detail="Database is busy. Please retry the request.",
            ) from error
        raise
    finally:
        db.close()
