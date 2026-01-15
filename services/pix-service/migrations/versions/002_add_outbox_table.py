"""Add outbox table for transactional consistency

Revision ID: 002_outbox
Revises: 001_initial
Create Date: 2025-01-15

SEC-001: Implements Outbox Pattern for distributed transaction consistency.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers
revision = '002_outbox'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create outbox_events table"""
    op.create_table(
        'outbox_events',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),

        # Event identification
        sa.Column('aggregate_type', sa.String(100), nullable=False),
        sa.Column('aggregate_id', sa.String(100), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),

        # Event data
        sa.Column('payload', JSONB, nullable=False, server_default='{}'),
        sa.Column('metadata', JSONB, server_default='{}'),

        # Processing status
        sa.Column('status', sa.String(20), nullable=False, server_default='PENDING'),
        sa.Column('retry_count', sa.Integer, nullable=False, server_default='0'),
        sa.Column('max_retries', sa.Integer, nullable=False, server_default='5'),
        sa.Column('last_error', sa.Text),

        # Processing tracking
        sa.Column('processed_at', sa.DateTime),
        sa.Column('scheduled_for', sa.DateTime, nullable=False, server_default=sa.func.now()),

        # Ordering
        sa.Column('sequence_number', sa.Integer, autoincrement=True),
    )

    # Create indexes for efficient querying
    op.create_index('ix_outbox_status_scheduled', 'outbox_events', ['status', 'scheduled_for'])
    op.create_index('ix_outbox_aggregate', 'outbox_events', ['aggregate_type', 'aggregate_id'])
    op.create_index('ix_outbox_created', 'outbox_events', ['created_at'])


def downgrade() -> None:
    """Drop outbox_events table"""
    op.drop_index('ix_outbox_created')
    op.drop_index('ix_outbox_aggregate')
    op.drop_index('ix_outbox_status_scheduled')
    op.drop_table('outbox_events')
