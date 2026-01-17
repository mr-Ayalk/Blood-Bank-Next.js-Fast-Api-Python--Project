from sqlalchemy import Column, ForeignKey, Integer, LargeBinary, LargeBinary, String, Date
from database import Base

# class BloodUnit(Base):
#     __tablename__ = "blood_units"

#     id = Column(Integer, primary_key=True, index=True)
#     blood_group = Column(String, index=True)
#     quantity = Column(Integer)
#     expiry_date = Column(Date)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    role = Column(String, default="USER")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer,   ForeignKey("users.id"))
    full_name = Column(String)
    blood_group = Column(String)
    phone = Column(String)
    address = Column(String)
    age = Column(Integer)
    gender = Column(String)
    health_status = Column(String)
    profile_image = Column( LargeBinary)
    last_donation_date = Column(Date)

class DonationRequest(Base):
    __tablename__ = "donation_requests"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    blood_group = Column(String)
    status = Column(String, default="PENDING")

class ReceiveRequest(Base):
    __tablename__ = "receive_requests"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    blood_group = Column(String)
    units = Column(Integer)
    status = Column(String, default="PENDING")