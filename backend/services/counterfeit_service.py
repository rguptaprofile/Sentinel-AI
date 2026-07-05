class CounterfeitDetectionService:
    def inspect_note(self, payload: dict) -> dict:
        feature_score = payload.get("feature_score")
        authenticity_score = 0.5 if feature_score is None else float(feature_score)

        if authenticity_score >= 0.78:
            verdict = "likely_genuine"
        elif authenticity_score >= 0.45:
            verdict = "needs_manual_review"
        else:
            verdict = "likely_counterfeit"

        return {
            "authenticity_score": round(authenticity_score, 2),
            "verdict": verdict,
            "status": "scanned",
        }
