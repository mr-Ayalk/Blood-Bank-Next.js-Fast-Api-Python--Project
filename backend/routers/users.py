from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import UserProfile, DonationRequest, ReceiveRequest, User
from schemas import ProfileCreate
from security import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/profile")
def update_profile(profile: ProfileCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # FIX: Use ["sub"] instead of .id
    user_id = int(current_user["sub"]) 
    
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    
    if db_profile:
        # Update existing
        for key, value in profile.dict().items():
            setattr(db_profile, key, value)
    else:
        # Create new
        db_profile = UserProfile(**profile.dict(), user_id=user_id)
        db.add(db_profile)
        
    db.commit()
    return {"message": "Profile updated successfully"}

@router.get("/profile/me")
def get_my_profile(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = int(current_user["sub"])
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile: 
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/request/donate")
def request_donate(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    new_req = DonationRequest(user_id=int(current_user["sub"]), status="PENDING")
    db.add(new_req)
    db.commit()
    return {"message": "Donation request submitted"}

@router.post("/request/receive")
def request_receive(blood_group: str, quantity: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    new_req = ReceiveRequest(user_id=int(current_user["sub"]), blood_group=blood_group, quantity=quantity, status="PENDING")
    db.add(new_req)
    db.commit()
    return {"message": "Blood request submitted"}