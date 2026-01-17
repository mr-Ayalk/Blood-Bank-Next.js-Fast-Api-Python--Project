from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, crud, schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/blood", response_model=schemas.BloodResponse)
def add_blood(blood: schemas.BloodCreate, db: Session = Depends(get_db)):
    return crud.create_blood(db, blood)

@app.get("/blood")
def get_blood(db: Session = Depends(get_db)):
    return crud.get_all_blood(db)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Blood Bank API"}