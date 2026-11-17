from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.auth.security import verify_password, create_access_token,hash_password
from app.repositories.users import get_user_by_email, create_user
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User

def register_user(db: Session, data: UserCreate):
    email = str(data.email).lower()
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(status_code=409,detail="Email already registered")
    password_hash = hash_password(data.password)
    try:
        user = create_user(db=db,full_name=data.full_name,email=email,password_hash=password_hash)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Could not register: email may already be registered")
    return user

def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email.lower())
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="User account is inactive",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return {"access_token": create_access_token(user.id),"token_type": "bearer"}

def update_user_profile(db: Session, user: User, data: UserUpdate):
    updates = data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        if value is None:
            raise HTTPException(status_code=422,detail=f"{field} cannot be null")
    if "email" in updates:
        updates["email"] = str(updates["email"]).lower()
        existing_user = get_user_by_email(db, updates["email"])
        if existing_user and existing_user.id != user.id:
            raise HTTPException(status_code=409,detail="Email already registered")
    for field, value in updates.items():
        setattr(user, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,detail="Email already registered")
    db.refresh(user)
    return user

def change_user_role(db: Session, user_id: int, role: str):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404,detail="User not found")
    user.role = role
    db.commit()
    db.refresh(user)
    return user