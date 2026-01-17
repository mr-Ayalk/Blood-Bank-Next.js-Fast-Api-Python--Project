from pydantic import BaseModel
from datetime import date

# ---------- AUTH ----------

class LoginSchema(BaseModel):
    email: str
    password: str

class RegisterSchema(LoginSchema):
    pass


# ---------- PROFILE ----------

class ProfileCreate(BaseModel):
    full_name: str
    blood_group: str
    phone: str
    address: str
    age: int
    gender: str
    health_status: str


# ---------- BLOOD ----------

class BloodCreate(BaseModel):
    blood_group: str
    quantity: int
    expiry_date: date

class BloodResponse(BloodCreate):
    id: int
