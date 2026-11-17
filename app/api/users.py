from fastapi import APIRouter, Depends, Query
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse,UserUpdate
from sqlalchemy.orm import Session
from app.db.database import get_db

from app.services.users import update_user_profile
from app.auth.permissions import require_admin
from app.schemas.user import UserRoleUpdate
from app.services.users import change_user_role
from app.repositories.users import get_users
from app.schemas.user import UserListResponse

router = APIRouter(prefix="/api/v1/users",tags=["Users"])

@router.get("", response_model=UserListResponse)
def list_users(
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    users, total = get_users(db, search, page, page_size)
    return {
        "items": users,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_my_profile(data: UserUpdate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    return update_user_profile(db, current_user, data)

@router.patch("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return change_user_role(db, user_id, data.role)
