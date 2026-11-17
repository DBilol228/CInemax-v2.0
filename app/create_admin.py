from sqlalchemy import select
import app.models
from app.db.database import SessionLocal
from app.models.user import User

def main():
    email = input("Registered email: ").strip().lower()
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))
        if user is None:
            print("User not found. Register first.")
            return
        user.role = "Admin"
        db.commit()
        print("User is now an Admin.")

if __name__ == "__main__":
    main()