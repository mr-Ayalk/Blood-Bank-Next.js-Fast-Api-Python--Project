from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import BloodUnit, UserProfile
from schemas import BloodCreate
from crud import add_blood
from dsa_logic import add_blood_unit

from security import require_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_admin)]
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Dashboard Statistics ---
@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(BloodUnit).count()
    available = db.query(BloodUnit).filter(BloodUnit.status == "AVAILABLE").count()
    expired = db.query(BloodUnit).filter(BloodUnit.status == "EXPIRED").count()

    # Calculate stock grouped by blood group
    grouped = {}
    units = db.query(BloodUnit).filter(BloodUnit.status == "AVAILABLE").all()
    for u in units:
        grouped[u.blood_group] = grouped.get(u.blood_group, 0) + u.quantity

    return {
        "total_units": total,
        "available_units": available,
        "expired_units": expired,
        "stock_by_group": grouped
    }

# --- Blood Records CRUD ---
@router.post("/blood")
def add_blood_record(blood: BloodCreate, db: Session = Depends(get_db)):
    unit = add_blood(db, blood)
    add_blood_unit(unit)  # Triggering DSA logic (e.g., updating a priority queue or tree)
    return unit

@router.put("/blood/{blood_id}")
def update_blood(blood_id: int, blood: BloodCreate, db: Session = Depends(get_db)):
    unit = db.query(BloodUnit).filter(BloodUnit.id == blood_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Blood unit not found")

    unit.blood_group = blood.blood_group
    unit.quantity = blood.quantity
    unit.expiry_date = blood.expiry_date

    db.commit()
    db.refresh(unit)
    return unit

@router.delete("/blood/{blood_id}")
def delete_blood(blood_id: int, db: Session = Depends(get_db)):
    unit = db.query(BloodUnit).filter(BloodUnit.id == blood_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Blood unit not found")

    db.delete(unit)
    db.commit()
    return {"message": "Deleted successfully"}

# --- User Management ---
@router.get("/donors")
def get_donors(db: Session = Depends(get_db)):
    # Assuming UserProfile has a role or type attribute to distinguish donors
    return db.query(UserProfile).all()

@router.get("/receivers")
def get_receivers(db: Session = Depends(get_db)):
    return db.query(UserProfile).all()