from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TagValue(Base):
    __tablename__ = 'tag_values'

    tag_value_id = Column(Integer, primary_key=True, autoincrement=True)
    tag_id = Column(Integer, ForeignKey('tags.tag_id'), nullable=False)
    value = Column(String(255), nullable=False)
    created_by = Column(Integer, ForeignKey('admins.admin_id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    tag = relationship("Tag", back_populates="tag_values")
    created_by_admin = relationship("Admin", back_populates="tag_values")

    def __repr__(self):
        return f"<TagValue(tag_value_id={self.tag_value_id}, value={self.value})>"
