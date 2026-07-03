class CounterfeitDetectionService:
    def inspect_note(self, payload: dict) -> dict:
        return {"authenticity": "unknown", "status": "model_not_connected", "input": payload}
