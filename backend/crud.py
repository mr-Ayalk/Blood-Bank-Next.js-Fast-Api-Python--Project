from sqlalchemy.orm import Session
from models import BloodUnit
from dsa_logic import add_blood_unit

def create_blood(db: Session, blood):
    unit = BloodUnit(**blood.dict())
    db.add(unit)
    db.commit()
    db.refresh(unit)
    add_blood_unit(unit)
    return unit

def get_all_blood(db: Session):
    return db.query(BloodUnit).all()
