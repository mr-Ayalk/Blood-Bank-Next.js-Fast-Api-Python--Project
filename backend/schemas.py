from pydantic import BaseModel
from datetime import date

class BloodCreate(BaseModel):
    blood_group: str
    quantity: int
    expiry_date: date

class BloodResponse(BloodCreate):
    id: int
