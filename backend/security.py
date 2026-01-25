from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime
# Import directly from your auth file to ensure the keys match!
from auth import SECRET_KEY, ALGORITHM 

security = HTTPBearer()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    try:
        # This will now work because the keys match
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.now():
            raise HTTPException(status_code=401, detail="Token expired")
            
        return payload 
    except JWTError:
        # This is where your 401 was coming from
        raise HTTPException(status_code=401, detail="Invalid token signature or malformed")

def require_admin(user = Depends(get_current_user)):
    role = str(user.get("role", "")).upper() 
    if role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only")
    return user