from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import DonationRequest, ReceiveRequest

router = APIRouter(prefix="/requests", tags=["Requests"])

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- User Donation Requests ---
@router.post("/donate", status_code=status.HTTP_201_CREATED)
def create_donation_request(user_id: int, blood_group: str, db: Session = Depends(get_db)):
    request = DonationRequest(user_id=user_id, blood_group=blood_group, status="PENDING")
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

# --- User Receive Requests ---
@router.post("/receive", status_code=status.HTTP_201_CREATED)
def create_receive_request(user_id: int, blood_group: str, units: int, db: Session = Depends(get_db)):
    request = ReceiveRequest(user_id=user_id, blood_group=blood_group, units=units, status="PENDING")
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

# --- Admin View Requests ---
@router.get("/")
def get_all_requests(db: Session = Depends(get_db)):
    return {
        "donations": db.query(DonationRequest).all(),
        "receives": db.query(ReceiveRequest).all()
    }

# --- Approval Endpoints ---
@router.post("/donate/{request_id}/approve")
def approve_donation(request_id: int, db: Session = Depends(get_db)):
    req = db.query(DonationRequest).filter(DonationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Donation request not found")
    
    req.status = "APPROVED"
    db.commit()
    db.refresh(req)
    return req

@router.post("/receive/{request_id}/approve")
def approve_receive(request_id: int, db: Session = Depends(get_db)):
    req = db.query(ReceiveRequest).filter(ReceiveRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Receive request not found")
    
    req.status = "APPROVED"
    db.commit()
    db.refresh(req)
    return req