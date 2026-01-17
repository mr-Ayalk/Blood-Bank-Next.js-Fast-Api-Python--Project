from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import BloodCreate
from crud import add_blood

router = APIRouter(prefix="/blood")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/")
def add_blood_unit(blood: BloodCreate, db: Session = Depends(get_db)):
    return add_blood(db, blood)
