class AlertNotifier:
    def send(self, alert: dict) -> dict:
        return {"status": "queued", "alert": alert}
