from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import requests
from dotenv import load_dotenv
import os

load_dotenv()

FIREBASE_PROJECT_ID = os.getenv("YOUR_FIREBASE_PROJECT_ID")
FIREBASE_CERTS_URL = os.getenv("YOUR_FIREBASE_CERTS_URL")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_firebase_certs():
    response = requests.get(FIREBASE_CERTS_URL)
    response.raise_for_status()
    return response.json()

def decode_firebase_token(token: str = Depends(oauth2_scheme)):
    try:
        certs = get_firebase_certs()
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in certs.keys():
            if key == unverified_header["kid"]:
                rsa_key = {
                    "kty": "RSA",
                    "kid": key,
                    "use": "sig",
                    "n": certs[key].split("-----")[2].strip(),
                    "e": "AQAB",
                }
        if rsa_key:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=FIREBASE_PROJECT_ID,
                issuer=f"https://securetoken.google.com/{FIREBASE_PROJECT_ID}",
            )
            return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )