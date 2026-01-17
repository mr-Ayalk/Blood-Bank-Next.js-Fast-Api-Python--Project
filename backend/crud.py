from sqlalchemy.orm import Session
from models import User, UserProfile, BloodUnit
from auth import hash_password

def create_user(db: Session, email, password, role="USER"):
    user = User(email=email, password_hash=hash_password(password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_profile(db: Session, user_id, data):
    profile = UserProfile(user_id=user_id, **data.dict())
    db.add(profile)
    db.commit()
    return profile

def add_blood(db: Session, blood):
    unit = BloodUnit(**blood.dict())
    db.add(unit)
    db.commit()
    return unit
