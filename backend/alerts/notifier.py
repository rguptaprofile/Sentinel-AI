from __future__ import annotations

import json
from urllib.error import URLError
from urllib.request import Request, urlopen

from backend.config.settings import settings


class AlertNotifier:
    def send(self, alert: dict) -> dict:
        if not settings.mha_alert_api_base_url or not settings.mha_alert_api_key:
            return {"status": "pending_configuration", "channel": "mha_alert", "alert": alert}

        request = Request(
            settings.mha_alert_api_base_url.rstrip("/") + "/alerts",
            data=json.dumps(alert).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {settings.mha_alert_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=10) as response:
                body = response.read().decode("utf-8")
                return {"status": "submitted", "channel": "mha_alert", "status_code": response.status, "response": body}
        except URLError as exc:
            return {"status": "submission_failed", "channel": "mha_alert", "error": str(exc)}
