from pydantic import BaseModel
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    email: str
    role: str

class UserCreate(UserBase):
    firebase_uid: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class AttendanceSessionBase(BaseModel):
    latitude: float
    longitude: float

class AttendanceSessionCreate(AttendanceSessionBase):
    pass

class AttendanceSession(AttendanceSessionBase):
    id: int
    teacher_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True

class AttendanceRecordBase(BaseModel):
    session_id: int
    student_id: int

class AttendanceRecordCreate(AttendanceRecordBase):
    pass

class AttendanceRecord(AttendanceRecordBase):
    id: int
    timestamp: datetime.datetime

    class Config:
        orm_mode = True
