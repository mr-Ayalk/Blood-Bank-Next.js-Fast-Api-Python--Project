from sqlalchemy import Column, Integer, String, Date
from database import Base

class BloodUnit(Base):
    __tablename__ = "blood_units"

    id = Column(Integer, primary_key=True, index=True)
    blood_group = Column(String, index=True)
    quantity = Column(Integer)
    expiry_date = Column(Date)
