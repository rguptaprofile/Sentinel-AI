from __future__ import annotations

from datetime import datetime
from typing import Any, Iterable, Type

from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from backend.config.settings import settings
from backend.database.models import (
    DOCUMENT_MODELS,
    AlertRecord,
    CitizenReportRecord,
    CounterfeitScanRecord,
    FraudGraphNodeRecord,
    GeoIncidentRecord,
    ModelRunRecord,
    MongoDocument,
    TransactionEventRecord,
    UserRecord,
)


client = MongoClient(settings.mongodb_url, serverSelectionTimeoutMS=settings.mongodb_timeout_ms)
mongo_db: Database = client[settings.mongodb_db_name]


def collection_for(model: Type[MongoDocument]) -> Collection:
    return mongo_db[model.collection_name]


def init_db() -> None:
    client.admin.command("ping")
    _ensure_indexes()
    _seed_demo_data()


def get_db():
    yield mongo_db


def insert_document(db: Database, document: MongoDocument) -> MongoDocument:
    db[document.collection_name].insert_one(document.to_mongo())
    return document


def list_documents(
    db: Database,
    model: Type[MongoDocument],
    *,
    filter_query: dict[str, Any] | None = None,
    sort: list[tuple[str, int]] | None = None,
    limit: int | None = None,
) -> list[MongoDocument]:
    cursor = db[model.collection_name].find(filter_query or {})
    if sort:
        cursor = cursor.sort(sort)
    if limit:
        cursor = cursor.limit(limit)
    return [model.from_mongo(row) for row in cursor]


def count_documents(db: Database, model: Type[MongoDocument], filter_query: dict[str, Any] | None = None) -> int:
    return db[model.collection_name].count_documents(filter_query or {})


def _ensure_indexes() -> None:
    directions = {-1: DESCENDING, 1: ASCENDING}
    for model in DOCUMENT_MODELS:
        for field_name, direction in model.indexes:
            mongo_db[model.collection_name].create_index([(field_name, directions[direction])])


def _insert_many_if_empty(model: Type[MongoDocument], documents: Iterable[MongoDocument]) -> None:
    collection = collection_for(model)
    if collection.count_documents({}) > 0:
        return
    collection.insert_many([document.to_mongo() for document in documents])


def _seed_demo_data() -> None:
    _insert_many_if_empty(
        CitizenReportRecord,
        [
            CitizenReportRecord(channel="mobile_app", description="UPI collect request impersonating bank official", location="Mumbai, Maharashtra", amount=85000, risk_score=87, incident_type="UPI Scam", status="investigating"),
            CitizenReportRecord(channel="ivr", description="AI-generated voice call claiming to be from Income Tax Department", location="Delhi NCR", amount=250000, risk_score=94, incident_type="Voice Phishing", status="investigating"),
            CitizenReportRecord(channel="police_portal", description="Fake 500 notes detected at local market", location="Chennai, Tamil Nadu", amount=15000, risk_score=62, incident_type="Counterfeit Currency", status="active"),
            CitizenReportRecord(channel="whatsapp", description="Fake crypto investment scheme via WhatsApp group", location="Bangalore, Karnataka", amount=500000, risk_score=89, incident_type="Investment Fraud", status="investigating"),
            CitizenReportRecord(channel="mobile_app", description="Tampered QR code redirecting parking payments", location="Hyderabad, Telangana", amount=12000, risk_score=71, incident_type="QR Code Scam", status="active"),
        ],
    )
    _insert_many_if_empty(
        TransactionEventRecord,
        [
            TransactionEventRecord(account_id="ACC-78234", account_holder="Rajesh Kumar", transaction_type="UPI Transfer", amount=85000, merchant="Unknown UPI ID", location="Mumbai", status="flagged", risk_score=92, event_time=datetime.utcnow()),
            TransactionEventRecord(account_id="ACC-45123", account_holder="Priya Sharma", transaction_type="NEFT", amount=250000, merchant="Offshore Account", location="Delhi", status="blocked", risk_score=98, event_time=datetime.utcnow()),
            TransactionEventRecord(account_id="ACC-91234", account_holder="Ananya Reddy", transaction_type="Wire Transfer", amount=500000, merchant="Crypto Exchange", location="Bangalore", status="under_review", risk_score=85, event_time=datetime.utcnow()),
            TransactionEventRecord(account_id="ACC-33456", account_holder="Vikram Rao", transaction_type="UPI Transfer", amount=12000, merchant="Parking QR", location="Hyderabad", status="flagged", risk_score=74, event_time=datetime.utcnow()),
            TransactionEventRecord(account_id="ACC-12345", account_holder="Kiran Patel", transaction_type="Debit Card", amount=5500, merchant="Amazon India", location="Ahmedabad", status="cleared", risk_score=12, event_time=datetime.utcnow()),
        ],
    )
    _insert_many_if_empty(
        GeoIncidentRecord,
        [
            GeoIncidentRecord(incident_type="digital_fraud", latitude=19.076, longitude=72.8777, district="Mumbai", state="Maharashtra", risk_score=0.95),
            GeoIncidentRecord(incident_type="digital_fraud", latitude=28.6139, longitude=77.209, district="Delhi", state="Delhi", risk_score=0.98),
            GeoIncidentRecord(incident_type="digital_fraud", latitude=12.9716, longitude=77.5946, district="Bangalore", state="Karnataka", risk_score=0.82),
            GeoIncidentRecord(incident_type="digital_fraud", latitude=13.0827, longitude=80.2707, district="Chennai", state="Tamil Nadu", risk_score=0.71),
            GeoIncidentRecord(incident_type="digital_fraud", latitude=17.385, longitude=78.4867, district="Hyderabad", state="Telangana", risk_score=0.68),
        ],
    )
    _insert_many_if_empty(
        FraudGraphNodeRecord,
        [
            FraudGraphNodeRecord(node_type="suspect", label="Scammer A", risk_score=0.95, x=400, y=200),
            FraudGraphNodeRecord(node_type="account", label="UPI mule-7823", risk_score=0.88, x=250, y=150),
            FraudGraphNodeRecord(node_type="account", label="UPI mule-4512", risk_score=0.82, x=550, y=150),
            FraudGraphNodeRecord(node_type="phone", label="Phone +91-98xxx", risk_score=0.76, x=400, y=80),
            FraudGraphNodeRecord(node_type="victim", label="Victim Cluster", risk_score=0.30, x=400, y=350),
        ],
    )
    _insert_many_if_empty(
        AlertRecord,
        [
            AlertRecord(title="Critical: AI Voice Scam Surge", severity="critical", source="speech_ai", summary="47 new voice phishing reports in Delhi NCR", region="Delhi NCR"),
            AlertRecord(title="Counterfeit Alert: 500 Notes", severity="medium", source="computer_vision", summary="Cluster of counterfeit currency reports in Chennai markets", region="Tamil Nadu"),
            AlertRecord(title="Fraud Network Detected", severity="high", source="graph_ai", summary="AI identified connected fraud ring across 3 states", region="Multi-State"),
        ],
    )
    _insert_many_if_empty(CounterfeitScanRecord, [CounterfeitScanRecord(denomination=500, serial_number="XX7391", authenticity_score=0.31, verdict="likely_counterfeit")])
    _insert_many_if_empty(
        ModelRunRecord,
        [
            ModelRunRecord(model_name="vision_counterfeit_v1", model_type="computer_vision", score=0.69, verdict="ready", features={"seed": True}),
            ModelRunRecord(model_name="nlp_scam_script_v1", model_type="nlp_llm", score=0.83, verdict="ready", features={"seed": True}),
            ModelRunRecord(model_name="speech_spoofing_v1", model_type="speech_ai", score=0.78, verdict="ready", features={"seed": True}),
            ModelRunRecord(model_name="graph_fraud_ring_v1", model_type="graph_ai", score=0.86, verdict="ready", features={"seed": True}),
            ModelRunRecord(model_name="geo_hotspot_v1", model_type="geospatial_intelligence", score=0.74, verdict="ready", features={"seed": True}),
        ],
    )
    _insert_many_if_empty(
        UserRecord,
        [
            UserRecord(name="Rajesh Kumar", email="rajesh.kumar@email.com", role="citizen", status="active", reports_count=3),
            UserRecord(name="Inspector Sharma", email="sharma@police.gov.in", role="police", status="active"),
            UserRecord(name="HDFC Fraud Team", email="fraud@hdfcbank.com", role="bank", status="active"),
            UserRecord(name="System Admin", email="admin@sentinelai.gov.in", role="admin", status="active"),
        ],
    )
