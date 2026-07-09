from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ModelSignal:
    model_name: str
    model_type: str
    score: float
    verdict: str
    features: dict


def _clamp(value: float) -> float:
    return round(max(0.0, min(value, 1.0)), 2)


class VisionCounterfeitModel:
    name = "vision_counterfeit_v1"
    model_type = "computer_vision"

    def predict(self, payload: dict) -> ModelSignal:
        score = payload.get("feature_score")
        if score is None:
            image_uri = (payload.get("image_uri") or "").lower()
            serial = (payload.get("serial_number") or "").lower()
            score = 0.35
            if any(term in image_uri for term in ["blur", "fake", "tampered"]):
                score += 0.35
            if serial.startswith(("xx", "fake")):
                score += 0.25
        score = _clamp(float(score))
        verdict = "likely_counterfeit" if score >= 0.7 else "manual_review" if score >= 0.4 else "likely_genuine"
        return ModelSignal(self.name, self.model_type, score, verdict, {"counterfeit_probability": score})


class ScamLanguageModel:
    name = "nlp_scam_script_v1"
    model_type = "nlp_llm"

    def predict(self, payload: dict) -> ModelSignal:
        transcript = (payload.get("transcript") or payload.get("description") or "").lower()
        indicators = payload.get("indicators") or []
        terms = ["otp", "kyc", "digital arrest", "urgent", "account blocked", "income tax", "crypto", "loan app"]
        hits = [term for term in terms if term in transcript]
        score = _clamp(0.15 + len(hits) * 0.11 + len(indicators) * 0.08)
        verdict = "script_match" if score >= 0.7 else "suspicious_language" if score >= 0.4 else "benign_language"
        return ModelSignal(self.name, self.model_type, score, verdict, {"matched_terms": hits, "indicator_count": len(indicators)})


class SpeechSpoofingModel:
    name = "speech_spoofing_v1"
    model_type = "speech_ai"

    def predict(self, payload: dict) -> ModelSignal:
        transcript = (payload.get("transcript") or "").lower()
        provided = payload.get("voice_confidence")
        score = float(provided) if provided is not None else 0.22
        if "ai-generated voice" in transcript or "voice clone" in transcript:
            score += 0.45
        if "ivr" in (payload.get("channel") or "").lower():
            score += 0.08
        score = _clamp(score)
        verdict = "voice_spoof_likely" if score >= 0.72 else "voice_review" if score >= 0.42 else "voice_low_risk"
        return ModelSignal(self.name, self.model_type, score, verdict, {"spoof_probability": score})


class GraphFraudRingModel:
    name = "graph_fraud_ring_v1"
    model_type = "graph_ai"

    def predict(self, payload: dict) -> ModelSignal:
        amount = float(payload.get("amount") or 0)
        suspected_number = payload.get("suspected_number")
        account = payload.get("account_id") or payload.get("transaction_id")
        score = 0.2
        if amount >= 200000:
            score += 0.35
        elif amount >= 50000:
            score += 0.2
        if suspected_number:
            score += 0.18
        if account:
            score += 0.12
        score = _clamp(score)
        verdict = "ring_link_likely" if score >= 0.7 else "possible_ring_link" if score >= 0.42 else "isolated_event"
        return ModelSignal(self.name, self.model_type, score, verdict, {"amount": amount, "has_suspect_contact": bool(suspected_number)})


class GeospatialHotspotModel:
    name = "geo_hotspot_v1"
    model_type = "geospatial_intelligence"

    def predict(self, payload: dict) -> ModelSignal:
        location = (payload.get("location") or "").lower()
        hotspot_terms = ["delhi", "mumbai", "pune", "bangalore", "chennai", "hyderabad", "kolkata"]
        matched = [city for city in hotspot_terms if city in location]
        score = _clamp(0.28 + (0.34 if matched else 0) + (0.16 if payload.get("latitude") and payload.get("longitude") else 0))
        verdict = "hotspot_overlap" if score >= 0.62 else "monitor_region" if score >= 0.4 else "low_geo_pressure"
        return ModelSignal(self.name, self.model_type, score, verdict, {"matched_hotspots": matched})


class AgenticFusionModel:
    def __init__(self) -> None:
        self.models = [
            VisionCounterfeitModel(),
            ScamLanguageModel(),
            SpeechSpoofingModel(),
            GraphFraudRingModel(),
            GeospatialHotspotModel(),
        ]

    def analyze(self, payload: dict) -> dict:
        signals = [model.predict(payload) for model in self.models]
        weights = {
            "computer_vision": 0.16,
            "nlp_llm": 0.24,
            "speech_ai": 0.18,
            "graph_ai": 0.24,
            "geospatial_intelligence": 0.18,
        }
        risk = round(sum(signal.score * weights[signal.model_type] for signal in signals), 2)
        verdict = "critical_threat" if risk >= 0.75 else "high_risk" if risk >= 0.58 else "watchlist" if risk >= 0.38 else "low_risk"
        priority = "P1" if risk >= 0.75 else "P2" if risk >= 0.58 else "P3" if risk >= 0.38 else "P4"
        actions = [
            "Create shared intelligence alert for connected agencies",
            "Map suspect account, phone, and location links in fraud graph",
            "Route high-confidence evidence for manual investigator review",
        ]
        if risk < 0.38:
            actions = ["Log event, keep passive monitoring active"]
        return {"risk_score": risk, "verdict": verdict, "priority": priority, "signals": signals, "recommended_actions": actions}
