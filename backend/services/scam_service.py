class ScamDetectionService:
    def classify(self, payload: dict) -> dict:
        return {"risk_score": None, "status": "model_not_connected", "input": payload}
