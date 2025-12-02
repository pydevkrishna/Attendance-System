from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, models, schemas, auth
from database import SessionLocal, engine
from typing import List
from math import radians, sin, cos, sqrt, atan2

app = FastAPI()

@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_firebase_uid(db, firebase_uid=user.firebase_uid)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user)

@app.post("/teacher/location")
def set_location(
    session: schemas.AttendanceSessionCreate,
    db: Session = Depends(get_db),
    user_data: dict = Depends(auth.decode_firebase_token),
):
    user = crud.get_user_by_firebase_uid(db, firebase_uid=user_data["uid"])
    if not user or user.role != "teacher":
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.create_attendance_session(db=db, session=session, teacher_id=user.id)

@app.get("/teacher/attendance", response_model=List[schemas.AttendanceRecord])
def get_attendance(
    db: Session = Depends(get_db),
    user_data: dict = Depends(auth.decode_firebase_token),
):
    user = crud.get_user_by_firebase_uid(db, firebase_uid=user_data["uid"])
    if not user or user.role != "teacher":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    session = crud.get_latest_attendance_session(db)
    if not session:
        raise HTTPException(status_code=404, detail="No active attendance session")

    return crud.get_attendance_records(db, session_id=session.id)

@app.post("/student/mark-attendance")
def mark_attendance(
    latitude: float,
    longitude: float,
    db: Session = Depends(get_db),
    user_data: dict = Depends(auth.decode_firebase_token),
):
    user = crud.get_user_by_firebase_uid(db, firebase_uid=user_data["uid"])
    if not user or user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")

    session = crud.get_latest_attendance_session(db)
    if not session:
        raise HTTPException(status_code=404, detail="No active attendance session")

    R = 6371.0

    lat1 = radians(session.latitude)
    lon1 = radians(session.longitude)
    lat2 = radians(latitude)
    lon2 = radians(longitude)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c * 1000

    if distance > 50:
        raise HTTPException(status_code=400, detail="You are not in the required location")

    record = schemas.AttendanceRecordCreate(session_id=session.id, student_id=user.id)
    return crud.create_attendance_record(db, record)
