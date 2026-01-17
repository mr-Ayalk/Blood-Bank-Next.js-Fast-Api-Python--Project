from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import ProfileCreate
from crud import create_profile
from security import get_current_user

router = APIRouter(prefix="/users")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/profile")
def create_user_profile(
    data: ProfileCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_profile(db, int(user["sub"]), data)
