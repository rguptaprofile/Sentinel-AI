class ScamDetectionService:
    def classify(self, payload: dict) -> dict:
        indicators = payload.get("indicators") or []
        transcript = (payload.get("transcript") or "").lower()

        risk = 0.25 + min(len(indicators) * 0.12, 0.45)
        high_risk_terms = ["digital arrest", "otp", "kyc", "police", "urgent", "account blocked"]
        risk += sum(0.06 for term in high_risk_terms if term in transcript)
        risk_score = round(min(risk, 0.98), 2)

        if risk_score >= 0.75:
            verdict = "high_risk"
        elif risk_score >= 0.45:
            verdict = "suspicious"
        else:
            verdict = "low_risk"

        return {"risk_score": risk_score, "verdict": verdict, "status": "classified"}
