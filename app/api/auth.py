from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import TokenResponse
from app.services.users import register_user, login_user
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/api/v1/auth",tags=["Authentication"])

@router.post("/register",response_model=UserResponse,status_code=201)
def register(data: UserCreate,db: Session = Depends(get_db)):
    return register_user(db, data)

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    return login_user(db=db,email=form_data.username,password=form_data.password)

