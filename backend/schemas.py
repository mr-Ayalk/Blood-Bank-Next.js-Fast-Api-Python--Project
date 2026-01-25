
from pydantic import BaseModel
from datetime import date
from typing import Optional
from pydantic import BaseModel
from datetime import date
# ---------- AUTH ----------

class LoginSchema(BaseModel):
    email: str
    password: str

class RegisterSchema(LoginSchema):
    role: str = "USER" 

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# ---------- PROFILE ----------

class ProfileCreate(BaseModel):
    full_name: str
    blood_group: str
    phone: str
    address: str
    age: int
    gender: str
    health_status: str

    class Config:
        from_attributes = True


# ---------- BLOOD ----------

# class BloodCreate(BaseModel):
#     blood_group: str
#     quantity: int
#     expiry_date: date

class BloodCreate(BaseModel):
    blood_group: str
    quantity: int
    expiry_date: date  # Backend expects YYYY-MM-DD

    class Config:
        from_attributes = True
class BloodResponse(BloodCreate):
    id: int


# ---------- REQUESTS (The Missing Part) ----------

class RequestCreate(BaseModel):
    blood_group: str
    quantity: int
    
    