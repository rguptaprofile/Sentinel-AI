CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(160) NOT NULL,
    agency_type VARCHAR(60) NOT NULL,
    jurisdiction VARCHAR(160),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    role VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE citizen_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel VARCHAR(40) NOT NULL,
    language_code VARCHAR(12) NOT NULL DEFAULT 'en',
    reporter_contact_hash VARCHAR(128),
    description TEXT NOT NULL,
    incident_type VARCHAR(80),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    status VARCHAR(40) NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scam_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES citizen_reports(id),
    suspected_number VARCHAR(40),
    spoofing_score DECIMAL(5, 4),
    script_match_score DECIMAL(5, 4),
    voice_ai_score DECIMAL(5, 4),
    risk_score DECIMAL(5, 4),
    verdict VARCHAR(40) NOT NULL DEFAULT 'pending',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE counterfeit_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    denomination INTEGER NOT NULL,
    serial_number VARCHAR(32),
    authenticity_score DECIMAL(5, 4),
    verdict VARCHAR(40) NOT NULL DEFAULT 'pending',
    image_uri TEXT,
    feature_results JSONB NOT NULL DEFAULT '{}',
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transaction_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_hash VARCHAR(128) NOT NULL,
    counterparty_hash VARCHAR(128),
    amount DECIMAL(14, 2),
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    event_time TIMESTAMPTZ NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE call_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caller_hash VARCHAR(128),
    receiver_hash VARCHAR(128),
    telecom_circle VARCHAR(80),
    duration_seconds INTEGER,
    event_time TIMESTAMPTZ NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fraud_graph_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_type VARCHAR(60) NOT NULL,
    external_ref_hash VARCHAR(128) NOT NULL,
    risk_score DECIMAL(5, 4),
    attributes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (node_type, external_ref_hash)
);

CREATE TABLE fraud_graph_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_node_id UUID NOT NULL REFERENCES fraud_graph_nodes(id),
    target_node_id UUID NOT NULL REFERENCES fraud_graph_nodes(id),
    relationship_type VARCHAR(80) NOT NULL,
    confidence_score DECIMAL(5, 4),
    evidence JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE geo_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_type VARCHAR(80) NOT NULL,
    source_table VARCHAR(80),
    source_id UUID,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    district VARCHAR(120),
    state VARCHAR(120),
    risk_score DECIMAL(5, 4),
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(180) NOT NULL,
    severity VARCHAR(40) NOT NULL,
    source VARCHAR(80) NOT NULL,
    target_agency_id UUID REFERENCES agencies(id),
    summary TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(40) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE evidence_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_reference VARCHAR(120),
    generated_by UUID REFERENCES users(id),
    package_hash VARCHAR(128) NOT NULL,
    chain_of_custody JSONB NOT NULL DEFAULT '[]',
    contents JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES users(id),
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_citizen_reports_incident_type ON citizen_reports(incident_type);
CREATE INDEX idx_scam_sessions_risk_score ON scam_sessions(risk_score);
CREATE INDEX idx_counterfeit_scans_verdict ON counterfeit_scans(verdict);
CREATE INDEX idx_transaction_events_account_hash ON transaction_events(account_hash);
CREATE INDEX idx_call_events_caller_hash ON call_events(caller_hash);
CREATE INDEX idx_fraud_graph_edges_source ON fraud_graph_edges(source_node_id);
CREATE INDEX idx_geo_incidents_location ON geo_incidents(latitude, longitude);
CREATE INDEX idx_alerts_status_severity ON alerts(status, severity);
