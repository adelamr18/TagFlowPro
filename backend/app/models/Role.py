from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import relationship

Base = declarative_base()

class Role(Base):
    __tablename__ = 'roles'

    role_id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(100), nullable=False, unique=True)
    created_by = Column(Integer, sa.ForeignKey('admins.admin_id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    created_by_admin = relationship("Admin", back_populates="roles")
    users = relationship("User", back_populates="role")

    def __repr__(self):
        return f"<Role(role_id={self.role_id}, role_name={self.role_name})>"
