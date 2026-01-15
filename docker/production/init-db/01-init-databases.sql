-- ============================================
-- Aurora Pay - Database Initialization
-- Creates databases for each microservice
-- ============================================

-- Create databases for each service
CREATE DATABASE aurora_accounts;
CREATE DATABASE aurora_pix;
CREATE DATABASE aurora_cards;
CREATE DATABASE aurora_loans;
CREATE DATABASE aurora_kyc;
CREATE DATABASE aurora_compliance;
CREATE DATABASE aurora_wire;
CREATE DATABASE aurora_boleto;
CREATE DATABASE aurora_audit;

-- Create extensions for all databases
\c aurora_accounts
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_pix
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_cards
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_loans
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_kyc
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_compliance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_wire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_boleto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c aurora_audit
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant permissions (in production, use more restrictive permissions)
-- This is just for development/staging
