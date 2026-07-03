INSERT INTO agencies (name, agency_type, jurisdiction)
VALUES
    ('National Cybercrime Coordination Centre', 'law_enforcement', 'India'),
    ('Demo Bank Fraud Desk', 'financial_institution', 'India')
ON CONFLICT DO NOTHING;
