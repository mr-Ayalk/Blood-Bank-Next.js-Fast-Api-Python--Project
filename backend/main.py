from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session # Make sure this is imported for the type hint
from sqladmin import Admin, ModelView 
from database import SessionLocal, engine
import models, crud, schemas

# 1. Create tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# 2. CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Setup Admin Dashboard
admin = Admin(app, engine)

# 4. Register the Model with Admin
class BloodAdmin(ModelView, model=models.BloodUnit):
    column_list = [models.BloodUnit.id, models.BloodUnit.blood_group, models.BloodUnit.quantity, models.BloodUnit.expiry_date]
    form_columns = [models.BloodUnit.blood_group, models.BloodUnit.quantity, models.BloodUnit.expiry_date]
    icon = "fa-solid fa-droplet"
    name = "Blood Unit"

admin.add_view(BloodAdmin)

# 5. Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 6. API Routes
@app.post("/blood", response_model=schemas.BloodResponse)
def add_blood(blood: schemas.BloodCreate, db: Session = Depends(get_db)):
    return crud.create_blood(db, blood)

@app.get("/blood")
def get_blood(db: Session = Depends(get_db)):
    return crud.get_all_blood(db)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Blood Bank API"}