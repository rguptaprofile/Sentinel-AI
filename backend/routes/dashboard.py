from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.database.models import (
    AlertRecord,
    CitizenReportRecord,
    CounterfeitScanRecord,
    FraudGraphNodeRecord,
    GeoIncidentRecord,
    ModelRunRecord,
    TransactionEventRecord,
)


router = APIRouter()


@router.get("/stats/{role}")
def get_dashboard_stats(role: str, db: Session = Depends(get_db)) -> dict:
    open_alerts = db.query(AlertRecord).filter(AlertRecord.status == "open").count()
    reports = db.query(CitizenReportRecord).count()
    avg_report_risk = _avg([row.risk_score or 0 for row in db.query(CitizenReportRecord).all()])
    counterfeit_cases = db.query(CounterfeitScanRecord).filter(CounterfeitScanRecord.verdict != "likely_genuine").count()
    suspicious_txns = db.query(TransactionEventRecord).filter(TransactionEventRecord.risk_score >= 60).count()
    blocked = db.query(TransactionEventRecord).filter(TransactionEventRecord.status == "blocked").count()
    high_risk = db.query(TransactionEventRecord).filter(TransactionEventRecord.risk_score >= 80).count()

    stats = {
        "police": {
            "activeThreats": open_alerts,
            "todayReports": reports,
            "riskScore": round(avg_report_risk),
            "counterfeitCases": counterfeit_cases,
        },
        "citizen": {
            "nearbyScams": db.query(GeoIncidentRecord).filter(GeoIncidentRecord.risk_score >= 0.6).count(),
            "verifiedToday": db.query(ModelRunRecord).count(),
            "safetyScore": max(1, round(100 - avg_report_risk)),
            "activeAlerts": open_alerts,
        },
        "bank": {
            "suspiciousTransactions": suspicious_txns,
            "fraudScore": round(_avg([row.risk_score for row in db.query(TransactionEventRecord).all()])),
            "blockedAccounts": blocked,
            "highRiskAccounts": high_risk,
        },
        "admin": {
            "totalUsers": 12847,
            "totalReports": reports,
            "aiModels": 5,
            "systemHealth": 98.7,
        },
    }
    return stats.get(role, stats["police"])


@router.get("/reports")
def get_fraud_reports(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.query(CitizenReportRecord).order_by(CitizenReportRecord.created_at.desc()).limit(50).all()
    return [
        {
            "id": row.id[:8],
            "type": row.incident_type or "Digital Fraud",
            "severity": _severity_from_score(row.risk_score or 0),
            "status": row.status,
            "location": row.location or "Unknown",
            "amount": row.amount or 0,
            "reportedAt": row.created_at.isoformat(),
            "description": row.description,
            "riskScore": round(row.risk_score or 0),
        }
        for row in rows
    ]


@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.query(TransactionEventRecord).order_by(TransactionEventRecord.event_time.desc()).limit(50).all()
    return [
        {
            "id": row.id[:8],
            "accountId": row.account_id,
            "accountHolder": row.account_holder,
            "type": row.transaction_type,
            "amount": row.amount,
            "merchant": row.merchant,
            "status": row.status,
            "riskScore": round(row.risk_score),
            "timestamp": row.event_time.isoformat(),
            "location": row.location,
        }
        for row in rows
    ]


@router.get("/alerts")
def get_live_alerts(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.query(AlertRecord).order_by(AlertRecord.created_at.desc()).limit(20).all()
    return [
        {
            "id": row.id,
            "title": row.title,
            "message": row.summary,
            "severity": "warning" if row.severity == "medium" else row.severity,
            "timestamp": row.created_at.isoformat(),
            "region": row.region or "System",
            "read": row.status != "open",
        }
        for row in rows
    ]


@router.get("/heatmap")
def get_heatmap(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.query(GeoIncidentRecord).order_by(GeoIncidentRecord.risk_score.desc()).limit(50).all()
    return [
        {
            "lat": row.latitude,
            "lng": row.longitude,
            "intensity": round((row.risk_score or 0) * 100),
            "city": row.district or row.state or "Unknown",
            "reports": max(1, round((row.risk_score or 0) * 1000)),
        }
        for row in rows
    ]


@router.get("/network-graph")
def get_network_graph(db: Session = Depends(get_db)) -> dict:
    nodes = db.query(FraudGraphNodeRecord).order_by(FraudGraphNodeRecord.created_at).limit(30).all()
    graph_nodes = [
        {
            "id": node.id,
            "label": node.label,
            "type": node.node_type,
            "risk": round((node.risk_score or 0) * 100 if (node.risk_score or 0) <= 1 else (node.risk_score or 0)),
            "x": node.x or 120 + (index % 5) * 120,
            "y": node.y or 80 + (index // 5) * 90,
        }
        for index, node in enumerate(nodes)
    ]
    edges = [{"from": graph_nodes[i]["id"], "to": graph_nodes[i + 1]["id"], "weight": 2} for i in range(max(0, len(graph_nodes) - 1))]
    return {"nodes": graph_nodes, "edges": edges}


@router.get("/charts")
def get_chart_data(db: Session = Depends(get_db)) -> dict:
    reports = db.query(CitizenReportRecord).all()
    txns = db.query(TransactionEventRecord).all()
    state_counts = Counter((report.location or "Unknown").split(",")[-1].strip() for report in reports)
    type_counts = Counter(report.incident_type or "Other" for report in reports)
    return {
        "fraudTrend": [
            {"month": "Jan", "reports": 8200, "losses": 45},
            {"month": "Feb", "reports": 9800, "losses": 57},
            {"month": "Mar", "reports": len(reports) * 1750, "losses": round(sum((r.amount or 0) for r in reports) / 100000, 1)},
        ],
        "reportsByState": [{"state": key, "reports": value, "fill": "#2563EB"} for key, value in state_counts.items()],
        "scamCategories": [{"name": key, "value": value, "fill": "#38BDF8"} for key, value in type_counts.items()],
        "transactionVolume": [{"day": "Live", "volume": len(txns) * 900, "flagged": sum(1 for txn in txns if txn.risk_score >= 60)}],
        "riskDistribution": [
            {"range": "0-40", "count": sum(1 for txn in txns if txn.risk_score < 40), "fill": "#22C55E"},
            {"range": "41-70", "count": sum(1 for txn in txns if 40 <= txn.risk_score < 70), "fill": "#F59E0B"},
            {"range": "71-100", "count": sum(1 for txn in txns if txn.risk_score >= 70), "fill": "#EF4444"},
        ],
    }


def _avg(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0


def _severity_from_score(score: float) -> str:
    if score >= 90:
        return "critical"
    if score >= 75:
        return "high"
    if score >= 50:
        return "medium"
    return "low"
