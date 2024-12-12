"""Add Files and FileRows tables

Revision ID: 995c645a498c
Revises: 58431b9e191e
Create Date: 2024-12-09 22:28:09.875436

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '995c645a498c'
down_revision: Union[str, None] = '58431b9e191e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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
