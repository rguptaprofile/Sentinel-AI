from pymongo.database import Database

from backend.alerts.notifier import AlertNotifier
from backend.database.connection import insert_document
from backend.database.models import AlertRecord, FraudGraphNodeRecord, ModelRunRecord
from backend.services.ai_models import AgenticFusionModel, ModelSignal


class IntelligenceFusionService:
    def __init__(self) -> None:
        self.fusion_model = AgenticFusionModel()

    def analyze(self, db: Database, payload: dict) -> dict:
        result = self.fusion_model.analyze(payload)
        for signal in result["signals"]:
            self._store_model_run(db, signal, payload)

        alert_id = None
        if result["risk_score"] >= 0.58:
            alert = AlertRecord(
                title=f"{result['priority']} digital fraud threat detected",
                severity="critical" if result["risk_score"] >= 0.75 else "high",
                source="agentic_fusion",
                summary=f"{result['verdict']} with fused risk {int(result['risk_score'] * 100)}%",
                region=payload.get("location"),
                payload={
                    "verdict": result["verdict"],
                    "recommended_actions": result["recommended_actions"],
                    "signals": [signal.__dict__ for signal in result["signals"]],
                },
            )
            insert_document(db, alert)
            alert_id = alert.id
            submission = AlertNotifier().send({"id": alert.id, "title": alert.title, "severity": alert.severity, "summary": alert.summary, "region": alert.region})
            db[AlertRecord.collection_name].update_one({"_id": alert.id}, {"$set": {"payload.external_submission": submission}})
            self._upsert_graph_node(db, payload, result["risk_score"])

        return {**result, "alert_id": alert_id}

    def _store_model_run(self, db: Database, signal: ModelSignal, payload: dict) -> None:
        insert_document(
            db,
            ModelRunRecord(
                model_name=signal.model_name,
                model_type=signal.model_type,
                input_ref=payload.get("report_id") or payload.get("transaction_id") or payload.get("serial_number"),
                score=signal.score,
                verdict=signal.verdict,
                features=signal.features,
            )
        )

    def _upsert_graph_node(self, db: Database, payload: dict, risk_score: float) -> None:
        label = payload.get("suspected_number") or payload.get("transaction_id") or "Fused threat cluster"
        collection = db[FraudGraphNodeRecord.collection_name]
        exists = collection.find_one({"label": label})
        if exists:
            collection.update_one({"_id": exists["_id"]}, {"$max": {"risk_score": risk_score}})
            return
        insert_document(
            db,
            FraudGraphNodeRecord(
                node_type="suspect" if payload.get("suspected_number") else "case",
                label=label,
                risk_score=risk_score,
                x=420,
                y=210,
                attributes={"source": "agentic_fusion", "location": payload.get("location")},
            )
        )
