# # from sqlalchemy import create_engine
# # from sqlalchemy.orm import sessionmaker, declarative_base
# # import os

# # DATABASE_URL = os.getenv("DATABASE_URL")

# # engine = create_engine(DATABASE_URL)
# # SessionLocal = sessionmaker(bind=engine)

# # Base = declarative_base()
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from dotenv import load_dotenv
# import os

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")
# print("DATABASE_URL =", DATABASE_URL)  # debug (remove later)

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(bind=engine)
# Base = declarative_base()
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Fix for Neon/PostgreSQL: ensures the driver is explicitly psycopg2 
# and adds connection pooling to prevent SSL drops.
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Checks if connection is alive before every request
    pool_recycle=300,    # Closes and reopens connections every 5 minutes
    pool_size=5,         # Number of permanent connections
    max_overflow=10      # Extra connections allowed during high traffic
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()