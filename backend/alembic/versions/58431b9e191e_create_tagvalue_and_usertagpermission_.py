# alembic revision file
"""
Revision ID: 58431b9e191e
Revises: 126aa1208d5e
Create Date: 2024-12-09 19:59:15.082295
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '58431b9e191e'
down_revision: Union[str, None] = '126aa1208d5e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create 'roles' table
    op.create_table('roles',
        sa.Column('role_id', sa.Integer(), sa.Identity(always=False, start=1, increment=1), nullable=False),
        sa.Column('role_name', sa.String(100), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, default=sa.func.now()),
        sa.ForeignKeyConstraint(['created_by'], ['admins.admin_id']),
        sa.PrimaryKeyConstraint('role_id')
    )

    # Create 'tags' table
    op.create_table('tags',
        sa.Column('tag_id', sa.Integer(), sa.Identity(always=False, start=1, increment=1), nullable=False),
        sa.Column('tag_name', sa.String(100), nullable=False),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, default=sa.func.now()),
        sa.ForeignKeyConstraint(['created_by'], ['admins.admin_id']),
        sa.PrimaryKeyConstraint('tag_id')
    )

    # Create 'users' table
    op.create_table('users',
        sa.Column('user_id', sa.Integer(), sa.Identity(always=False, start=1, increment=1), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, default=sa.func.now()),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['role_id'], ['roles.role_id']),
        sa.PrimaryKeyConstraint('user_id')
    )

    # Create 'tag_values' table
    op.create_table('tag_values',
        sa.Column('tag_value_id', sa.Integer(), sa.Identity(always=False, start=1, increment=1), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.Column('value', sa.String(255), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, default=sa.func.now()),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.tag_id']),
        sa.ForeignKeyConstraint(['created_by'], ['admins.admin_id']),
        sa.PrimaryKeyConstraint('tag_value_id')
    )

    # Create 'user_tag_permissions' table
    op.create_table('user_tag_permissions',
        sa.Column('id', sa.Integer(), sa.Identity(always=False, start=1, increment=1), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id']),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.tag_id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create 'files' table
    op.create_table('files',
        sa.Column('file_id', sa.Integer(), sa.Identity(always=False, start=1, increment=1), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('uploaded_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, default=sa.func.now()),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.user_id']),
        sa.PrimaryKeyConstraint('file_id')
    )

    # Create 'file_rows' table
    op.create_table('file_rows',
        sa.Column('row_id', sa.Integer(), sa.Identity(always=False, start=1, increment=1), nullable=False),
        sa.Column('file_id', sa.Integer(), nullable=False),
        sa.Column('data', sa.JSON(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.Column('tag_value_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['file_id'], ['files.file_id']),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.tag_id']),
        sa.ForeignKeyConstraint(['tag_value_id'], ['tag_values.tag_value_id']),
        sa.PrimaryKeyConstraint('row_id')
    )

def downgrade() -> None:
    # Drop 'file_rows' table
    op.drop_table('file_rows')

    # Drop 'files' table
    op.drop_table('files')

    # Drop 'user_tag_permissions' table
    op.drop_table('user_tag_permissions')

    # Drop 'tag_values' table
    op.drop_table('tag_values')

    # Drop 'tags' table
    op.drop_table('tags')

    # Drop 'users' table
    op.drop_table('users')

    # Drop 'roles' table
    op.drop_table('roles')
