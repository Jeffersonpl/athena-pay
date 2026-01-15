"""Initial PIX Service Schema

Revision ID: 001
Revises: None
Create Date: 2024-01-15 10:00:00

Production-ready PIX service database schema with:
- PIX Keys management
- PIX Transactions with E2E tracking
- QR Codes (static and dynamic)
- Devolutions
- Webhooks
- Audit trail
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, ENUM

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Enums
pix_key_type = ENUM(
    'CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM',
    name='pix_key_type',
    create_type=False
)

pix_key_status = ENUM(
    'PENDING', 'ACTIVE', 'INACTIVE', 'PORTABILITY_REQUESTED', 'PORTABILITY_CLAIMED',
    name='pix_key_status',
    create_type=False
)

transaction_status = ENUM(
    'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED', 'PARTIALLY_REVERSED',
    name='transaction_status',
    create_type=False
)

transaction_type = ENUM(
    'TRANSFER', 'PAYMENT', 'WITHDRAWAL', 'DEPOSIT', 'DEVOLUTION',
    name='transaction_type',
    create_type=False
)

qrcode_type = ENUM(
    'STATIC', 'DYNAMIC', 'DYNAMIC_DUE_DATE',
    name='qrcode_type',
    create_type=False
)

devolution_status = ENUM(
    'REQUESTED', 'PROCESSING', 'COMPLETED', 'REJECTED',
    name='devolution_status',
    create_type=False
)


def upgrade() -> None:
    # Create extensions
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    # Create enums
    op.execute("CREATE TYPE pix_key_type AS ENUM ('CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM')")
    op.execute("CREATE TYPE pix_key_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'PORTABILITY_REQUESTED', 'PORTABILITY_CLAIMED')")
    op.execute("CREATE TYPE transaction_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED', 'PARTIALLY_REVERSED')")
    op.execute("CREATE TYPE transaction_type AS ENUM ('TRANSFER', 'PAYMENT', 'WITHDRAWAL', 'DEPOSIT', 'DEVOLUTION')")
    op.execute("CREATE TYPE qrcode_type AS ENUM ('STATIC', 'DYNAMIC', 'DYNAMIC_DUE_DATE')")
    op.execute("CREATE TYPE devolution_status AS ENUM ('REQUESTED', 'PROCESSING', 'COMPLETED', 'REJECTED')")

    # ============================================
    # PIX Keys Table
    # ============================================
    op.create_table(
        'pix_keys',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('account_id', UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('customer_id', UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('key_type', pix_key_type, nullable=False),
        sa.Column('key_value', sa.String(77), nullable=False, unique=True),
        sa.Column('key_value_hash', sa.String(64), nullable=False, index=True),
        sa.Column('status', pix_key_status, nullable=False, server_default='PENDING'),
        sa.Column('participant_ispb', sa.String(8), nullable=False, server_default='00000000'),
        sa.Column('owner_name', sa.String(200), nullable=False),
        sa.Column('owner_document', sa.String(14), nullable=False),
        sa.Column('owner_document_type', sa.String(4), nullable=False),
        sa.Column('branch', sa.String(4), nullable=True),
        sa.Column('account_number', sa.String(20), nullable=False),
        sa.Column('account_type', sa.String(20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('activated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('deactivated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('metadata', JSONB, nullable=True),
    )
    op.create_index('ix_pix_keys_account_status', 'pix_keys', ['account_id', 'status'])
    op.create_index('ix_pix_keys_type_status', 'pix_keys', ['key_type', 'status'])

    # ============================================
    # PIX Transactions Table
    # ============================================
    op.create_table(
        'pix_transactions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('e2e_id', sa.String(32), nullable=False, unique=True, index=True),
        sa.Column('tx_id', sa.String(35), nullable=True, index=True),
        sa.Column('transaction_type', transaction_type, nullable=False),
        sa.Column('status', transaction_status, nullable=False, server_default='PENDING'),

        # Amount
        sa.Column('amount', sa.Numeric(15, 2), nullable=False),
        sa.Column('original_amount', sa.Numeric(15, 2), nullable=False),
        sa.Column('fee_amount', sa.Numeric(15, 2), nullable=True, server_default='0'),
        sa.Column('currency', sa.String(3), nullable=False, server_default='BRL'),

        # Payer (sender)
        sa.Column('payer_account_id', UUID(as_uuid=True), nullable=True, index=True),
        sa.Column('payer_name', sa.String(200), nullable=False),
        sa.Column('payer_document', sa.String(14), nullable=False),
        sa.Column('payer_document_type', sa.String(4), nullable=False),
        sa.Column('payer_ispb', sa.String(8), nullable=False),
        sa.Column('payer_branch', sa.String(4), nullable=True),
        sa.Column('payer_account', sa.String(20), nullable=False),
        sa.Column('payer_account_type', sa.String(20), nullable=False),

        # Payee (receiver)
        sa.Column('payee_account_id', UUID(as_uuid=True), nullable=True, index=True),
        sa.Column('payee_name', sa.String(200), nullable=False),
        sa.Column('payee_document', sa.String(14), nullable=False),
        sa.Column('payee_document_type', sa.String(4), nullable=False),
        sa.Column('payee_ispb', sa.String(8), nullable=False),
        sa.Column('payee_branch', sa.String(4), nullable=True),
        sa.Column('payee_account', sa.String(20), nullable=False),
        sa.Column('payee_account_type', sa.String(20), nullable=False),
        sa.Column('payee_key', sa.String(77), nullable=True),
        sa.Column('payee_key_type', sa.String(10), nullable=True),

        # Description
        sa.Column('description', sa.String(140), nullable=True),
        sa.Column('purpose', sa.String(4), nullable=True),

        # QR Code reference
        sa.Column('qrcode_id', UUID(as_uuid=True), nullable=True, index=True),

        # Settlement
        sa.Column('settlement_date', sa.Date, nullable=True, index=True),
        sa.Column('settlement_time', sa.DateTime(timezone=True), nullable=True),

        # SPI response
        sa.Column('spi_request_id', sa.String(50), nullable=True),
        sa.Column('spi_response', JSONB, nullable=True),
        sa.Column('rejection_reason', sa.String(200), nullable=True),
        sa.Column('rejection_code', sa.String(20), nullable=True),

        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),

        # Devolution tracking
        sa.Column('devolution_amount', sa.Numeric(15, 2), nullable=True, server_default='0'),
        sa.Column('is_devolution', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('original_e2e_id', sa.String(32), nullable=True),

        # Audit
        sa.Column('metadata', JSONB, nullable=True),
        sa.Column('idempotency_key', sa.String(64), nullable=True, unique=True),
    )
    op.create_index('ix_pix_transactions_created_at', 'pix_transactions', ['created_at'])
    op.create_index('ix_pix_transactions_settlement', 'pix_transactions', ['settlement_date', 'status'])
    op.create_index('ix_pix_transactions_payer_date', 'pix_transactions', ['payer_account_id', 'created_at'])
    op.create_index('ix_pix_transactions_payee_date', 'pix_transactions', ['payee_account_id', 'created_at'])

    # ============================================
    # PIX QR Codes Table
    # ============================================
    op.create_table(
        'pix_qrcodes',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('tx_id', sa.String(35), nullable=False, unique=True, index=True),
        sa.Column('qrcode_type', qrcode_type, nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='ACTIVE'),

        # Payee info
        sa.Column('payee_account_id', UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('payee_key', sa.String(77), nullable=False),
        sa.Column('payee_key_type', sa.String(10), nullable=False),
        sa.Column('payee_name', sa.String(200), nullable=False),
        sa.Column('payee_city', sa.String(50), nullable=False),

        # Amount (optional for static)
        sa.Column('amount', sa.Numeric(15, 2), nullable=True),
        sa.Column('currency', sa.String(3), nullable=False, server_default='BRL'),

        # Description
        sa.Column('description', sa.String(140), nullable=True),

        # Due date (for dynamic with due date)
        sa.Column('due_date', sa.Date, nullable=True),
        sa.Column('expiration_date', sa.DateTime(timezone=True), nullable=True),

        # Interest and fines (for dynamic with due date)
        sa.Column('interest_rate', sa.Numeric(5, 2), nullable=True),
        sa.Column('fine_rate', sa.Numeric(5, 2), nullable=True),
        sa.Column('discount_rate', sa.Numeric(5, 2), nullable=True),

        # BR Code (EMV format)
        sa.Column('br_code', sa.Text, nullable=False),
        sa.Column('br_code_base64', sa.Text, nullable=True),

        # Location
        sa.Column('location_url', sa.String(500), nullable=True),

        # Usage stats
        sa.Column('times_used', sa.Integer, nullable=False, server_default='0'),
        sa.Column('total_amount_received', sa.Numeric(15, 2), nullable=False, server_default='0'),
        sa.Column('max_uses', sa.Integer, nullable=True),

        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),

        sa.Column('metadata', JSONB, nullable=True),
    )
    op.create_index('ix_pix_qrcodes_payee_type', 'pix_qrcodes', ['payee_account_id', 'qrcode_type'])

    # ============================================
    # PIX Devolutions Table
    # ============================================
    op.create_table(
        'pix_devolutions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('devolution_id', sa.String(35), nullable=False, unique=True, index=True),
        sa.Column('original_e2e_id', sa.String(32), nullable=False, index=True),
        sa.Column('original_transaction_id', UUID(as_uuid=True), nullable=False),
        sa.Column('new_e2e_id', sa.String(32), nullable=True, unique=True),
        sa.Column('new_transaction_id', UUID(as_uuid=True), nullable=True),

        sa.Column('status', devolution_status, nullable=False, server_default='REQUESTED'),
        sa.Column('amount', sa.Numeric(15, 2), nullable=False),
        sa.Column('reason', sa.String(200), nullable=True),
        sa.Column('reason_code', sa.String(10), nullable=True),

        # Requestor
        sa.Column('requested_by', UUID(as_uuid=True), nullable=False),
        sa.Column('requested_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),

        # Processing
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('rejection_reason', sa.String(200), nullable=True),

        # SPI
        sa.Column('spi_request_id', sa.String(50), nullable=True),
        sa.Column('spi_response', JSONB, nullable=True),

        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('metadata', JSONB, nullable=True),

        sa.ForeignKeyConstraint(['original_transaction_id'], ['pix_transactions.id']),
    )

    # ============================================
    # PIX Webhooks Table
    # ============================================
    op.create_table(
        'pix_webhooks',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('account_id', UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('pix_key', sa.String(77), nullable=True),
        sa.Column('url', sa.String(500), nullable=False),
        sa.Column('secret', sa.String(64), nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=False, server_default='true'),

        # Events to notify
        sa.Column('notify_received', sa.Boolean, nullable=False, server_default='true'),
        sa.Column('notify_sent', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('notify_devolution', sa.Boolean, nullable=False, server_default='true'),

        # Stats
        sa.Column('total_deliveries', sa.Integer, nullable=False, server_default='0'),
        sa.Column('successful_deliveries', sa.Integer, nullable=False, server_default='0'),
        sa.Column('failed_deliveries', sa.Integer, nullable=False, server_default='0'),
        sa.Column('last_delivery_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_error', sa.String(500), nullable=True),

        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('metadata', JSONB, nullable=True),
    )
    op.create_index('ix_pix_webhooks_account_active', 'pix_webhooks', ['account_id', 'is_active'])

    # ============================================
    # PIX Webhook Deliveries Table
    # ============================================
    op.create_table(
        'pix_webhook_deliveries',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('webhook_id', UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('transaction_id', UUID(as_uuid=True), nullable=True),
        sa.Column('devolution_id', UUID(as_uuid=True), nullable=True),

        sa.Column('event_type', sa.String(50), nullable=False),
        sa.Column('payload', JSONB, nullable=False),

        sa.Column('status', sa.String(20), nullable=False, server_default='PENDING'),
        sa.Column('attempts', sa.Integer, nullable=False, server_default='0'),
        sa.Column('max_attempts', sa.Integer, nullable=False, server_default='5'),

        sa.Column('response_status', sa.Integer, nullable=True),
        sa.Column('response_body', sa.Text, nullable=True),
        sa.Column('error_message', sa.String(500), nullable=True),

        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('last_attempt_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('next_attempt_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True),

        sa.ForeignKeyConstraint(['webhook_id'], ['pix_webhooks.id']),
    )
    op.create_index('ix_pix_webhook_deliveries_pending', 'pix_webhook_deliveries', ['status', 'next_attempt_at'])

    # ============================================
    # PIX Limits Table
    # ============================================
    op.create_table(
        'pix_limits',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('account_id', UUID(as_uuid=True), nullable=False, unique=True),

        # Transaction limits
        sa.Column('daily_limit', sa.Numeric(15, 2), nullable=False, server_default='5000'),
        sa.Column('daily_used', sa.Numeric(15, 2), nullable=False, server_default='0'),
        sa.Column('nightly_limit', sa.Numeric(15, 2), nullable=False, server_default='1000'),
        sa.Column('nightly_used', sa.Numeric(15, 2), nullable=False, server_default='0'),
        sa.Column('per_transaction_limit', sa.Numeric(15, 2), nullable=False, server_default='1000'),

        # Monthly limits
        sa.Column('monthly_limit', sa.Numeric(15, 2), nullable=True),
        sa.Column('monthly_used', sa.Numeric(15, 2), nullable=False, server_default='0'),

        # Control
        sa.Column('last_reset_date', sa.Date, nullable=False, server_default=sa.text('CURRENT_DATE')),
        sa.Column('last_monthly_reset', sa.Date, nullable=True),

        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
    )

    # ============================================
    # Audit Log Table
    # ============================================
    op.create_table(
        'pix_audit_log',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('entity_type', sa.String(50), nullable=False),
        sa.Column('entity_id', UUID(as_uuid=True), nullable=False),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('actor_id', UUID(as_uuid=True), nullable=True),
        sa.Column('actor_type', sa.String(50), nullable=True),
        sa.Column('old_values', JSONB, nullable=True),
        sa.Column('new_values', JSONB, nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('correlation_id', sa.String(64), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
    )
    op.create_index('ix_pix_audit_log_entity', 'pix_audit_log', ['entity_type', 'entity_id'])
    op.create_index('ix_pix_audit_log_created', 'pix_audit_log', ['created_at'])
    op.create_index('ix_pix_audit_log_correlation', 'pix_audit_log', ['correlation_id'])


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('pix_audit_log')
    op.drop_table('pix_limits')
    op.drop_table('pix_webhook_deliveries')
    op.drop_table('pix_webhooks')
    op.drop_table('pix_devolutions')
    op.drop_table('pix_qrcodes')
    op.drop_table('pix_transactions')
    op.drop_table('pix_keys')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS devolution_status')
    op.execute('DROP TYPE IF EXISTS qrcode_type')
    op.execute('DROP TYPE IF EXISTS transaction_type')
    op.execute('DROP TYPE IF EXISTS transaction_status')
    op.execute('DROP TYPE IF EXISTS pix_key_status')
    op.execute('DROP TYPE IF EXISTS pix_key_type')
