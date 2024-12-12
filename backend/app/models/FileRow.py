# app/models/FileRow.py
from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime
from app.models import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class FileRow(Base):
    __tablename__ = 'file_rows'

    row_id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(Integer, ForeignKey('files.file_id'), nullable=False)
    data = Column(JSON, nullable=False)
    tag_id = Column(Integer, ForeignKey('tags.tag_id'), nullable=False)
    tag_value_id = Column(Integer, ForeignKey('tag_values.tag_value_id'), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    file = relationship("File", back_populates="rows")
    tag = relationship("Tag", back_populates="file_rows")
    tag_value = relationship("TagValue", back_populates="file_rows")