from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
import models
from dsa_logic import load_inventory
from routers import auth, users, blood, admin, requests

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blood Bank Management System",
    description="A DSA-driven system using Min-Heaps for Emergency Matching",
    version="1.0.0"
)

# Configure CORS for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(blood.router)
app.include_router(admin.router)
app.include_router(requests.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Blood Bank API is running",
        "dsa_features": ["Min-Heap Expiry Tracking", "Hash Map Indexing", "Compatibility Logic"]
    }

# --- CRITICAL STARTUP LOGIC ---
@app.on_event("startup")
def startup_event():
    """
    This runs when the server starts.
    It hydrates the in-memory Min-Heap from the SQL database.
    """
    print("Initializing DSA Inventory...")
    # No 'db' argument passed here because load_inventory() 
    # handles its own SessionLocal() internally now.
    load_inventory()
    print("System Ready.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)



