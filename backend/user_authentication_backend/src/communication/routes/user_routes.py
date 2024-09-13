#
# This file is part of first_version_qmsAIA.
#
# first_version_qmsAIA is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published by the
# Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# social_network_miner_compliance_check is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
# details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with first_version_qmsAIA (file COPYING in the main directory). If not, see
# http://www.gnu.org/licenses/.

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

from communication.database_connector.db_connector import connect_to_db
from communication.models.user import User

# Load environment variables
load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
# Set default value in case it is none:
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "45"))

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Sign up the user and store him in the database
@router.post("/signup/", response_model=User)
async def signup(user: User = Body(...), db=Depends(connect_to_db)):
    # Check if the username or email is already in database:
    existing_username = db["users"].find_one({"username": user.username})
    existing_email = db["users"].find_one({"email": user.email})
    if existing_username or existing_email:
        raise HTTPException(status_code=400, detail="Username or Email already registered")

    # Hash the password
    hashed_password = pwd_context.hash(user.password)
    user = User(username=user.username, email=user.email, password=hashed_password)
    user_dict = jsonable_encoder(user)
    # Insert the new user into the database
    new_user = db["users"].insert_one(user_dict)
    created_user = db["users"].find_one({"_id": new_user.inserted_id})
    return created_user


# Function to verify password
def __verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Function to authenticate user
def __authenticate_user(db, username: str, password: str):
    # Get user with username if the user exist
    user = db["users"].find_one({"username": username})
    if not user:
        # Check if user has entered email instead of username
        user = db["users"].find_one({"email": username})
        if not user:
            return False
        hashed_password = user['password']
    else:
        hashed_password = user['password']
    if not __verify_password(password, hashed_password):
        return False
    return user


# Function to create access token
def __create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Create access token endpoint -> login user
@router.post("/token/", response_model=dict)
async def login_for_access_token(form_data: User = Body(...), db=Depends(connect_to_db)):
    # Check if the user exists
    user = __authenticate_user(db, form_data.username, form_data.password)
    # User does not exist
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Add expiration date of token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # Create access token
    access_token = __create_access_token(
        data={"username": user['username'], "id": user['_id']},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Dependency to get current user from token
async def __get_current_user(token: str = Depends(oauth2_scheme), db=Depends(connect_to_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        # token_data = User(username=username) 
    except jwt.PyJWTError:
        raise credentials_exception

    user = db["users"].find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user


# Read secure data endpoint: Get the current user by the jwt token
@router.get("/secure-data/")
async def read_secure_data(current_user: User = Depends(__get_current_user)):
    return {"data": "This is secure data", "user": current_user}
