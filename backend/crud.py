from sqlalchemy.orm import Session
import models, schemas

def get_user_by_firebase_uid(db: Session, firebase_uid: str):
    return db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(firebase_uid=user.firebase_uid, email=user.email, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_attendance_session(db: Session, session: schemas.AttendanceSessionCreate, teacher_id: int):
    db_session = models.AttendanceSession(**session.dict(), teacher_id=teacher_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_latest_attendance_session(db: Session):
    return db.query(models.AttendanceSession).order_by(models.AttendanceSession.created_at.desc()).first()

def create_attendance_record(db: Session, record: schemas.AttendanceRecordCreate):
    db_record = models.AttendanceRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_attendance_records(db: Session, session_id: int):
    return db.query(models.AttendanceRecord).filter(models.AttendanceRecord.session_id == session_id).all()
