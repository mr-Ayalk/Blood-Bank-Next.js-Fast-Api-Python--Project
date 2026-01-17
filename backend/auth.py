import bcrypt
from jose import jwt
from datetime import datetime, timedelta

# Removed pwd_context = CryptContext(...) because it causes the error

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    # Convert password to bytes, generate salt, and hash
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    try:
        # Convert both to bytes and check
        return bcrypt.checkpw(
            password.encode('utf-8'), 
            hashed.encode('utf-8')
        )
    except Exception:
        # Returns false if the hash is malformed (plain text)
        return False

def create_token(user_id, role):
    # Note: Use datetime.now(timezone.utc) in newer python, 
    # but utcnow() still works for now
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)