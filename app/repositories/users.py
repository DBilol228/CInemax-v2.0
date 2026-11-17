from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session
from app.models.user import User

def get_user_by_email(db: Session, email: str):
    statement = select(User).where(User.email == email)
    return db.scalar(statement)

def create_user(db: Session, full_name: str, email: str, password_hash: str):
    user = User(full_name=full_name,email=email,password_hash=password_hash,role="Customer")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session, search: str | None, page: int, page_size: int):
    statement = select(User)
    if search:
        statement = statement.where(
            or_(
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
    total = db.scalar(
        select(func.count()).select_from(statement.subquery())
    )
    users = db.scalars(
        statement.order_by(User.id).offset((page - 1) * page_size).limit(page_size)
    ).all()
    return users, total
