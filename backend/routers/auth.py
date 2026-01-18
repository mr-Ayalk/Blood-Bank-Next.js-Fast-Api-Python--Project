from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import LoginSchema, RegisterSchema
from crud import create_user
from models import User
from auth import verify_password, create_token

router = APIRouter(prefix="/auth")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# File: C:\Users\hp\Desktop\blood-bank\backend\routers\auth.py

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    # Update this line to pass data.role 
    return create_user(db, data.email, data.password, role=data.role)

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email==data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")

    token = create_token(user.id, user.role)
    return {"token": token, "role": user.role}
