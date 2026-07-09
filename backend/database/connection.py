from sqlalchemy import create_engine
from sqlalchemy import inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from backend.config.settings import settings


connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db() -> None:
    from backend.database import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _ensure_sqlite_columns()
    _seed_demo_data()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_sqlite_columns() -> None:
    if not settings.database_url.startswith("sqlite"):
        return
    required_columns = {
        "citizen_reports": {
            "amount": "FLOAT",
            "risk_score": "FLOAT",
            "incident_type": "VARCHAR(80)",
        },
        "alerts": {
            "region": "VARCHAR(120)",
            "payload": "JSON DEFAULT '{}'",
        },
        "fraud_graph_nodes": {
            "x": "FLOAT",
            "y": "FLOAT",
            "attributes": "JSON DEFAULT '{}'",
        },
    }
    inspector = inspect(engine)
    with engine.begin() as conn:
        for table, columns in required_columns.items():
            if not inspector.has_table(table):
                continue
            existing = {column["name"] for column in inspector.get_columns(table)}
            for name, ddl in columns.items():
                if name not in existing:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))


def _seed_demo_data() -> None:
    from datetime import datetime

    from backend.database.models import (
        AlertRecord,
        CitizenReportRecord,
        CounterfeitScanRecord,
        FraudGraphNodeRecord,
        GeoIncidentRecord,
        ModelRunRecord,
        TransactionEventRecord,
    )

    db = SessionLocal()
    try:
        if db.query(CitizenReportRecord).count() == 0:
            reports = [
                ("mobile_app", "UPI collect request impersonating bank official", "Mumbai, Maharashtra", 85000, 87, "UPI Scam"),
                ("ivr", "AI-generated voice call claiming to be from Income Tax Department", "Delhi NCR", 250000, 94, "Voice Phishing"),
                ("police_portal", "Fake 500 notes detected at local market", "Chennai, Tamil Nadu", 15000, 62, "Counterfeit Currency"),
                ("whatsapp", "Fake crypto investment scheme via WhatsApp group", "Bangalore, Karnataka", 500000, 89, "Investment Fraud"),
                ("mobile_app", "Tampered QR code redirecting parking payments", "Hyderabad, Telangana", 12000, 71, "QR Code Scam"),
            ]
            for channel, description, location, amount, risk, incident_type in reports:
                db.add(
                    CitizenReportRecord(
                        channel=channel,
                        description=description,
                        location=location,
                        amount=amount,
                        risk_score=risk,
                        incident_type=incident_type,
                        status="investigating" if risk >= 80 else "active",
                    )
                )

        if db.query(TransactionEventRecord).count() == 0:
            transactions = [
                ("ACC-78234", "Rajesh Kumar", "UPI Transfer", 85000, "Unknown UPI ID", "Mumbai", "flagged", 92),
                ("ACC-45123", "Priya Sharma", "NEFT", 250000, "Offshore Account", "Delhi", "blocked", 98),
                ("ACC-91234", "Ananya Reddy", "Wire Transfer", 500000, "Crypto Exchange", "Bangalore", "under_review", 85),
                ("ACC-33456", "Vikram Rao", "UPI Transfer", 12000, "Parking QR", "Hyderabad", "flagged", 74),
                ("ACC-12345", "Kiran Patel", "Debit Card", 5500, "Amazon India", "Ahmedabad", "cleared", 12),
            ]
            for account_id, holder, txn_type, amount, merchant, location, status, risk in transactions:
                db.add(
                    TransactionEventRecord(
                        account_id=account_id,
                        account_holder=holder,
                        transaction_type=txn_type,
                        amount=amount,
                        merchant=merchant,
                        location=location,
                        status=status,
                        risk_score=risk,
                        event_time=datetime.utcnow(),
                    )
                )

        if db.query(GeoIncidentRecord).count() == 0:
            hotspots = [
                (19.076, 72.8777, "Mumbai", "Maharashtra", 0.95),
                (28.6139, 77.209, "Delhi", "Delhi", 0.98),
                (12.9716, 77.5946, "Bangalore", "Karnataka", 0.82),
                (13.0827, 80.2707, "Chennai", "Tamil Nadu", 0.71),
                (17.385, 78.4867, "Hyderabad", "Telangana", 0.68),
            ]
            for lat, lng, district, state, risk in hotspots:
                db.add(
                    GeoIncidentRecord(
                        incident_type="digital_fraud",
                        latitude=lat,
                        longitude=lng,
                        district=district,
                        state=state,
                        risk_score=risk,
                    )
                )

        if db.query(FraudGraphNodeRecord).count() == 0:
            nodes = [
                ("suspect", "Scammer A", 0.95, 400, 200),
                ("account", "UPI mule-7823", 0.88, 250, 150),
                ("account", "UPI mule-4512", 0.82, 550, 150),
                ("phone", "Phone +91-98xxx", 0.76, 400, 80),
                ("victim", "Victim Cluster", 0.30, 400, 350),
            ]
            for node_type, label, risk, x, y in nodes:
                db.add(FraudGraphNodeRecord(node_type=node_type, label=label, risk_score=risk, x=x, y=y))

        if db.query(AlertRecord).count() == 0:
            alerts = [
                ("Critical: AI Voice Scam Surge", "critical", "speech_ai", "47 new voice phishing reports in Delhi NCR", "Delhi NCR"),
                ("Counterfeit Alert: 500 Notes", "medium", "computer_vision", "Cluster of counterfeit currency reports in Chennai markets", "Tamil Nadu"),
                ("Fraud Network Detected", "high", "graph_ai", "AI identified connected fraud ring across 3 states", "Multi-State"),
            ]
            for title, severity, source, summary, region in alerts:
                db.add(AlertRecord(title=title, severity=severity, source=source, summary=summary, region=region))

        if db.query(CounterfeitScanRecord).count() == 0:
            db.add(CounterfeitScanRecord(denomination=500, serial_number="XX7391", authenticity_score=0.31, verdict="likely_counterfeit"))

        if db.query(ModelRunRecord).count() == 0:
            for name, model_type, score in [
                ("vision_counterfeit_v1", "computer_vision", 0.69),
                ("nlp_scam_script_v1", "nlp_llm", 0.83),
                ("speech_spoofing_v1", "speech_ai", 0.78),
                ("graph_fraud_ring_v1", "graph_ai", 0.86),
                ("geo_hotspot_v1", "geospatial_intelligence", 0.74),
            ]:
                db.add(ModelRunRecord(model_name=name, model_type=model_type, score=score, verdict="ready", features={"seed": True}))

        db.commit()
    finally:
        db.close()
