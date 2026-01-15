-- Aurora Pay Database Initialization
-- This script creates all schemas and initial setup

-- Create schemas for each service
CREATE SCHEMA IF NOT EXISTS accounts;
CREATE SCHEMA IF NOT EXISTS pix;
CREATE SCHEMA IF NOT EXISTS cards;
CREATE SCHEMA IF NOT EXISTS boleto;
CREATE SCHEMA IF NOT EXISTS wire;
CREATE SCHEMA IF NOT EXISTS loans;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS kyc;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS lgpd;

-- Grant permissions
GRANT ALL ON SCHEMA accounts TO aurora;
GRANT ALL ON SCHEMA pix TO aurora;
GRANT ALL ON SCHEMA cards TO aurora;
GRANT ALL ON SCHEMA boleto TO aurora;
GRANT ALL ON SCHEMA wire TO aurora;
GRANT ALL ON SCHEMA loans TO aurora;
GRANT ALL ON SCHEMA compliance TO aurora;
GRANT ALL ON SCHEMA kyc TO aurora;
GRANT ALL ON SCHEMA audit TO aurora;
GRANT ALL ON SCHEMA lgpd TO aurora;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== Accounts Schema ====================

CREATE TABLE IF NOT EXISTS accounts.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_number VARCHAR(14) UNIQUE NOT NULL,
    document_type VARCHAR(4) NOT NULL CHECK (document_type IN ('CPF', 'CNPJ')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    kyc_level INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES accounts.customers(id),
    account_number VARCHAR(20) UNIQUE NOT NULL,
    branch VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CHECKING', 'SAVINGS', 'PAYMENT')),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    balance DECIMAL(18, 2) DEFAULT 0,
    available_balance DECIMAL(18, 2) DEFAULT 0,
    blocked_balance DECIMAL(18, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts.accounts(id),
    type VARCHAR(30) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    balance_after DECIMAL(18, 2),
    description VARCHAR(500),
    reference_id VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_account ON accounts.transactions(account_id);
CREATE INDEX idx_transactions_created ON accounts.transactions(created_at);

-- ==================== PIX Schema ====================

CREATE TABLE IF NOT EXISTS pix.keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    key_type VARCHAR(10) NOT NULL CHECK (key_type IN ('CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM')),
    key_value VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pix.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    e2e_id VARCHAR(50) UNIQUE NOT NULL,
    source_account_id UUID NOT NULL,
    target_key VARCHAR(100),
    target_ispb VARCHAR(8),
    target_branch VARCHAR(10),
    target_account VARCHAR(20),
    target_name VARCHAR(255),
    target_document VARCHAR(14),
    amount DECIMAL(18, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    type VARCHAR(20) NOT NULL,
    description VARCHAR(140),
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    metadata JSONB
);

CREATE INDEX idx_pix_tx_e2e ON pix.transactions(e2e_id);
CREATE INDEX idx_pix_tx_source ON pix.transactions(source_account_id);
CREATE INDEX idx_pix_tx_created ON pix.transactions(created_at);

-- ==================== Cards Schema ====================

CREATE TABLE IF NOT EXISTS cards.cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    card_number_hash VARCHAR(64) NOT NULL,
    last_four VARCHAR(4) NOT NULL,
    expiry_month INT NOT NULL,
    expiry_year INT NOT NULL,
    brand VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('DEBIT', 'CREDIT', 'MULTIPLE')),
    variant VARCHAR(20) DEFAULT 'PHYSICAL',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    credit_limit DECIMAL(18, 2) DEFAULT 0,
    available_limit DECIMAL(18, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cards.cards(id),
    authorization_code VARCHAR(20),
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    merchant_name VARCHAR(255),
    merchant_category VARCHAR(10),
    status VARCHAR(20) DEFAULT 'PENDING',
    type VARCHAR(20) NOT NULL,
    installments INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_cards_tx_card ON cards.transactions(card_id);

-- ==================== Boleto Schema ====================

CREATE TABLE IF NOT EXISTS boleto.boletos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    digitable_line VARCHAR(60) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    due_date DATE NOT NULL,
    beneficiary_name VARCHAR(255) NOT NULL,
    beneficiary_document VARCHAR(14) NOT NULL,
    payer_name VARCHAR(255),
    payer_document VARCHAR(14),
    status VARCHAR(20) DEFAULT 'PENDING',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_boleto_barcode ON boleto.boletos(barcode);
CREATE INDEX idx_boleto_due_date ON boleto.boletos(due_date);

-- ==================== Wire Schema ====================

CREATE TABLE IF NOT EXISTS wire.transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_account_id UUID NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('TED', 'DOC')),
    target_bank VARCHAR(10) NOT NULL,
    target_branch VARCHAR(10) NOT NULL,
    target_account VARCHAR(20) NOT NULL,
    target_document VARCHAR(14) NOT NULL,
    target_name VARCHAR(255) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    purpose VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING',
    str_protocol VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

CREATE INDEX idx_wire_source ON wire.transfers(source_account_id);
CREATE INDEX idx_wire_status ON wire.transfers(status);

-- ==================== Loans Schema ====================

CREATE TABLE IF NOT EXISTS loans.credit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    score INT NOT NULL CHECK (score >= 0 AND score <= 1000),
    band VARCHAR(1) NOT NULL CHECK (band IN ('A', 'B', 'C', 'D', 'E')),
    factors JSONB,
    calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loans.loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    account_id UUID NOT NULL,
    product VARCHAR(30) NOT NULL,
    principal DECIMAL(18, 2) NOT NULL,
    interest_rate DECIMAL(8, 6) NOT NULL,
    installments INT NOT NULL,
    installment_value DECIMAL(18, 2) NOT NULL,
    total_amount DECIMAL(18, 2) NOT NULL,
    outstanding_balance DECIMAL(18, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    disbursement_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loans.installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID REFERENCES loans.loans(id),
    number INT NOT NULL,
    due_date DATE NOT NULL,
    principal DECIMAL(18, 2) NOT NULL,
    interest DECIMAL(18, 2) NOT NULL,
    total DECIMAL(18, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    paid_at TIMESTAMP,
    paid_amount DECIMAL(18, 2)
);

CREATE INDEX idx_loans_customer ON loans.loans(customer_id);
CREATE INDEX idx_installments_loan ON loans.installments(loan_id);
CREATE INDEX idx_installments_due ON loans.installments(due_date);

-- ==================== Compliance Schema ====================

CREATE TABLE IF NOT EXISTS compliance.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID,
    transaction_id UUID,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS compliance.screening_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    screening_type VARCHAR(30) NOT NULL,
    result VARCHAR(20) NOT NULL,
    matches JSONB,
    screened_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_customer ON compliance.alerts(customer_id);
CREATE INDEX idx_alerts_status ON compliance.alerts(status);

-- ==================== KYC Schema ====================

CREATE TABLE IF NOT EXISTS kyc.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    document_type VARCHAR(30) NOT NULL,
    file_path VARCHAR(500),
    file_hash VARCHAR(64),
    status VARCHAR(20) DEFAULT 'PENDING',
    validation_result JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    validated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kyc.face_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    selfie_path VARCHAR(500),
    document_id UUID REFERENCES kyc.documents(id),
    similarity_score DECIMAL(5, 4),
    liveness_score DECIMAL(5, 4),
    result VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kyc_docs_customer ON kyc.documents(customer_id);

-- ==================== Audit Schema ====================

CREATE TABLE IF NOT EXISTS audit.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    service VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_id VARCHAR(100),
    actor_type VARCHAR(30),
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    correlation_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_type ON audit.events(event_type);
CREATE INDEX idx_audit_actor ON audit.events(actor_id);
CREATE INDEX idx_audit_resource ON audit.events(resource_type, resource_id);
CREATE INDEX idx_audit_correlation ON audit.events(correlation_id);
CREATE INDEX idx_audit_created ON audit.events(created_at);

-- Partition audit events by month for performance
-- (In production, implement table partitioning)

-- ==================== Outbox Pattern (SEC-001) ====================

CREATE TABLE IF NOT EXISTS pix.outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'DEAD_LETTER')),
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 5,
    last_error TEXT,
    correlation_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    next_retry_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_outbox_status ON pix.outbox_events(status);
CREATE INDEX idx_outbox_next_retry ON pix.outbox_events(next_retry_at) WHERE status IN ('PENDING', 'FAILED');
CREATE INDEX idx_outbox_aggregate ON pix.outbox_events(aggregate_type, aggregate_id);

-- ==================== LGPD Schema (SEC-003) ====================

CREATE TABLE IF NOT EXISTS lgpd.consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    purpose VARCHAR(100) NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT true,
    granted_at TIMESTAMP DEFAULT NOW(),
    revoked_at TIMESTAMP,
    expires_at TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    UNIQUE(user_id, purpose)
);

CREATE TABLE IF NOT EXISTS lgpd.data_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('ACCESS', 'PORTABILITY', 'RECTIFICATION', 'ANONYMIZATION', 'DELETION')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED')),
    details JSONB,
    requested_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    completed_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS lgpd.processing_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    legal_basis VARCHAR(50) NOT NULL,
    data_categories TEXT[],
    retention_period VARCHAR(50),
    recipients TEXT[],
    international_transfer BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lgpd.anonymization_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    fields_anonymized TEXT[],
    anonymized_at TIMESTAMP DEFAULT NOW(),
    anonymized_by VARCHAR(100)
);

CREATE INDEX idx_lgpd_consents_user ON lgpd.consents(user_id);
CREATE INDEX idx_lgpd_requests_user ON lgpd.data_requests(user_id);
CREATE INDEX idx_lgpd_requests_status ON lgpd.data_requests(status);
CREATE INDEX idx_lgpd_activities_user ON lgpd.processing_activities(user_id);

-- ==================== Initial Data ====================

-- Insert test customer for development
INSERT INTO accounts.customers (id, document_number, document_type, name, email, phone, kyc_level, status)
VALUES
    ('00000000-0000-0000-0000-000000000001', '12345678901', 'CPF', 'Usuario Teste', 'teste@aurora.com', '11999999999', 2, 'ACTIVE')
ON CONFLICT (document_number) DO NOTHING;

-- Insert test account
INSERT INTO accounts.accounts (id, customer_id, account_number, branch, type, status, balance, available_balance)
VALUES
    ('acc-001', '00000000-0000-0000-0000-000000000001', '12345678', '0001', 'CHECKING', 'ACTIVE', 10000.00, 10000.00)
ON CONFLICT (account_number) DO NOTHING;

-- Insert test PIX key
INSERT INTO pix.keys (account_id, key_type, key_value, status)
VALUES
    ('acc-001', 'CPF', '12345678901', 'ACTIVE')
ON CONFLICT (key_value) DO NOTHING;

COMMIT;
