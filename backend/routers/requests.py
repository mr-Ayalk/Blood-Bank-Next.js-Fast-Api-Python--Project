from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import DonationRequest, ReceiveRequest, BloodUnit
from dsa_logic import emergency_match
from security import get_current_user
import models

router = APIRouter(prefix="/requests", tags=["Requests"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# --- 1. EMERGENCY ENDPOINT (Place this ABOVE /{request_id} routes) ---
@router.post("/receive/emergency")
def create_emergency_request(
    blood_group: str, 
    units: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Fix the encoding (B%2B comes in as B+, B+ comes in as B )
    sanitized_group = blood_group.replace(" ", "+")
    print(f"DEBUG: Processing Emergency for {sanitized_group}, Units: {units}")

    # 1. DSA Logic: Find compatible units via Min-Heap
    matched_units = emergency_match(sanitized_group, units)

    # 2. Check if we actually found anything
    if not matched_units or len(matched_units) < units:
        print(f"DEBUG: Stock empty for {sanitized_group}")
        raise HTTPException(
            status_code=400, # Use 400 (Bad Request) instead of 404 to distinguish from "Route not found"
            detail=f"Insufficient compatible stock. Found {len(matched_units) if matched_units else 0} units."
        )

    # 3. Create the Request Record
    new_req = ReceiveRequest(
        user_id=int(current_user["sub"]), 
        blood_group=sanitized_group, 
        units=units, 
        status="DISPATCHED"
    )
    db.add(new_req)

    # 4. Update individual BloodUnits in DB
    dispatched_list = []
    for unit in matched_units:
        db_unit = db.query(BloodUnit).filter(BloodUnit.id == unit.id).first()
        if db_unit:
            db_unit.status = "DISPATCHED"
            dispatched_list.append(f"{db_unit.blood_group} (ID: {db_unit.id})")
    
    db.commit()
    
    # CRITICAL: You MUST return a dictionary so FastAPI sends a 200 OK JSON response
    return {
        "status": "Success",
        "message": f"Successfully matched and dispatched {len(matched_units)} units.",
        "dispatched_units": dispatched_list
    }

# --- 2. STANDARD REQUESTS ---
@router.post("/donate", status_code=status.HTTP_201_CREATED)
def create_donation_request(user_id: int, blood_group: str, db: Session = Depends(get_db)):
    request = DonationRequest(user_id=user_id, blood_group=blood_group, status="PENDING")
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

@router.post("/receive", status_code=status.HTTP_201_CREATED)
def create_receive_request(user_id: int, blood_group: str, units: int, db: Session = Depends(get_db)):
    request = ReceiveRequest(user_id=user_id, blood_group=blood_group, units=units, status="PENDING")
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

# --- 3. ADMIN ENDPOINTS ---
@router.get("/")
def get_all_requests(db: Session = Depends(get_db)):
    return {
        "donations": db.query(DonationRequest).all(),
        "receives": db.query(ReceiveRequest).all()
    }

@router.post("/donate/{request_id}/approve")
def approve_donation(request_id: int, db: Session = Depends(get_db)):
    req = db.query(DonationRequest).filter(DonationRequest.id == request_id).first()
    if not req: raise HTTPException(status_code=404, detail="Not found")
    req.status = "APPROVED"
    db.commit()
    return req

@router.post("/receive/{request_id}/approve")
def approve_receive(request_id: int, db: Session = Depends(get_db)):
    req = db.query(ReceiveRequest).filter(ReceiveRequest.id == request_id).first()
    if not req: raise HTTPException(status_code=404, detail="Not found")
    req.status = "APPROVED"
    db.commit()
    return req