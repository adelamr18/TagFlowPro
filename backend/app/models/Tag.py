from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Tag(Base):
    __tablename__ = 'tags'

    tag_id = Column(Integer, primary_key=True, autoincrement=True)
    tag_name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255), nullable=True)
    created_by = Column(Integer, ForeignKey('admins.admin_id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    created_by_admin = relationship("Admin", back_populates="tags")
    tag_values = relationship("TagValue", back_populates="tag")
    user_permissions = relationship("UserTagPermission", back_populates="tag") 

    def __repr__(self):
        return f"<Tag(tag_id={self.tag_id}, tag_name={self.tag_name}, created_by={self.created_by})>"
