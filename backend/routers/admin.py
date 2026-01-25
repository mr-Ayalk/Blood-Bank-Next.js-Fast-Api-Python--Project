from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from datetime import datetime
import models 
from models import BloodUnit, UserProfile, User, DonationRequest, ReceiveRequest

from schemas import BloodCreate
from crud import add_blood

from dsa_logic import add_blood_unit, blood_inventory 
from security import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# 1. Overview Page Stats (Calculates from the Hash Map)
@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    now = datetime.now()
    
    # 1. Total count
    total = db.query(BloodUnit).count()
    
    # 2. Count "Available" but NOT expired
    available = db.query(BloodUnit).filter(
        BloodUnit.status == "AVAILABLE",
        BloodUnit.expiry_date > now
    ).count()
    
    # 3. Count units where date has passed OR status is already EXPIRED
    expired = db.query(BloodUnit).filter(
        (BloodUnit.expiry_date <= now) | (BloodUnit.status == "EXPIRED")
    ).count()
    
    # 4. Dispatched units
    dispatched = db.query(BloodUnit).filter(BloodUnit.status == "DISPATCHED").count()
    
    # 5. Stock by group (only counting safe/available units)
    # This matches the "SAFE" count on your records page
    grouped_stock = {}
    for bg in ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]:
        count = db.query(BloodUnit).filter(
            BloodUnit.blood_group == bg,
            BloodUnit.status == "AVAILABLE",
            BloodUnit.expiry_date > now
        ).count()
        grouped_stock[bg] = count

    return {
        "total_units": total,
        "available_units": available,
        "expired_units": expired,
        "dispatched_units": dispatched,
        "stock_by_group": grouped_stock
    }
# 2. Add Unit Button logic.
@router.post("/blood")
def add_blood_record(blood: BloodCreate, db: Session = Depends(get_db)):
    unit = add_blood(db, blood)
    add_blood_unit(unit) # Updates the Min-Heap
    return unit

@router.get("/blood")
def get_all_blood(db: Session = Depends(get_db)):
    # Sorting: Earliest expiry date first for frontend display
    return db.query(BloodUnit).filter(BloodUnit.status == "AVAILABLE").order_by(BloodUnit.expiry_date.asc()).all()

# 4. Donors Queue (FIFO logic)
@router.get("/donors")
def get_ordered_donors(db: Session = Depends(get_db)):
    return db.query(DonationRequest).filter(DonationRequest.status == "PENDING").order_by(DonationRequest.id.asc()).all()


# Now we use UserProfile and DonationRequest to remove the "not accessed" warning
@router.get("/donors/requests")
def get_donor_requests(db: Session = Depends(get_db)):
    # Joining DonationRequest with UserProfile to get the donor's name
    results = db.query(DonationRequest, UserProfile).join(
        UserProfile, DonationRequest.user_id == UserProfile.user_id
    ).filter(DonationRequest.status == "PENDING").all()

    # Formating the output for the frontend
    return [
        {
            "request_id": req.id,
            "donor_name": profile.full_name,
            "blood_group": req.blood_group,
            "units": req.units,
            "status": req.status
        }
        for req, profile in results
    ]