from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class UserTagPermission(Base):
    __tablename__ = 'user_tag_permissions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    tag_id = Column(Integer, ForeignKey('tags.tag_id'), nullable=False)

    user = relationship("User", back_populates="user_permissions")
    tag = relationship("Tag", back_populates="user_permissions")

    def __repr__(self):
        return f"<UserTagPermission(id={self.id}, user_id={self.user_id}, tag_id={self.tag_id})>"
