from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    role_id = Column(Integer, ForeignKey('roles.role_id'), nullable=False)
    
    role = relationship("Role", back_populates="users")
    user_permissions = relationship("UserTagPermission", back_populates="user") 
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, username={self.username}, email={self.email})>"
