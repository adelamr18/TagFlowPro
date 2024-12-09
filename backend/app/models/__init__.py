# app/models/__init__.py
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from .User import User
from .Admin import Admin
from .Tag import Tag
from .Role import Role
from .User import User
from .UserTagPermission import UserTagPermission
from .TagValue import TagValue