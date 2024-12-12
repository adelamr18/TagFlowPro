from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.orm import relationship

Base = declarative_base()

class Admin(Base):
    __tablename__ = 'admins'

    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    roles = relationship("Role", back_populates="created_by_admin")
    tags = relationship("Tag", back_populates="created_by_admin")

    def __repr__(self):
        return f"<Admin(admin_id={self.admin_id}, username={self.username})>"
