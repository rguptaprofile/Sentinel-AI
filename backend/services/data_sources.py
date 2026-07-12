from __future__ import annotations

from dataclasses import dataclass

from backend.config.settings import settings


@dataclass(frozen=True)
class DataSource:
    key: str
    name: str
    base_url: str | None
    api_key: str | None
    feeds: tuple[str, ...]
    model_targets: tuple[str, ...]

    def status(self) -> dict:
        return {
            "key": self.key,
            "name": self.name,
            "configured": bool(self.base_url and self.api_key),
            "base_url_configured": bool(self.base_url),
            "api_key_configured": bool(self.api_key),
            "feeds": list(self.feeds),
            "model_targets": list(self.model_targets),
        }


def configured_sources() -> list[DataSource]:
    return [
        DataSource(
            key="telecom",
            name="Telecom active-scam and number-spoofing feed",
            base_url=settings.telecom_api_base_url,
            api_key=settings.telecom_api_key,
            feeds=("call_flow_sequences", "number_spoofing_signatures", "active_session_flags"),
            model_targets=("digital_arrest_scam", "citizen_fraud_shield"),
        ),
        DataSource(
            key="mha_alert",
            name="MHA automated alert submission gateway",
            base_url=settings.mha_alert_api_base_url,
            api_key=settings.mha_alert_api_key,
            feeds=("alert_submission", "case_priority_feedback"),
            model_targets=("digital_arrest_scam", "fraud_graph"),
        ),
        DataSource(
            key="ncrb",
            name="NCRB complaint/reporting feed",
            base_url=settings.ncrb_api_base_url,
            api_key=settings.ncrb_api_key,
            feeds=("citizen_reports", "complaint_labels", "jurisdiction_metadata"),
            model_targets=("digital_arrest_scam", "geospatial_crime", "citizen_fraud_shield"),
        ),
        DataSource(
            key="whatsapp",
            name="WhatsApp citizen fraud-report channel",
            base_url=settings.whatsapp_api_base_url,
            api_key=settings.whatsapp_api_key,
            feeds=("messages", "media_metadata", "language_tags"),
            model_targets=("citizen_fraud_shield", "digital_arrest_scam"),
        ),
        DataSource(
            key="speech_ai",
            name="Speech and AI-voice analysis provider",
            base_url=settings.speech_ai_api_base_url,
            api_key=settings.speech_ai_api_key,
            feeds=("ivr_audio", "voice_spoof_scores", "speaker_metadata"),
            model_targets=("citizen_fraud_shield", "digital_arrest_scam"),
        ),
        DataSource(
            key="geocoding",
            name="Geocoding and location enrichment provider",
            base_url=settings.geocoding_api_base_url,
            api_key=settings.geocoding_api_key,
            feeds=("address_to_coordinate", "district_lookup", "hotspot_enrichment"),
            model_targets=("geospatial_crime",),
        ),
        DataSource(
            key="bank_fraud",
            name="Bank/payment network fraud metadata feed",
            base_url=settings.bank_fraud_api_base_url,
            api_key=settings.bank_fraud_api_key,
            feeds=("transactions", "device_fingerprints", "account_linkages", "mule_account_flags"),
            model_targets=("fraud_graph",),
        ),
        DataSource(
            key="currency_image",
            name="Verified currency image and counterfeit feature feed",
            base_url=settings.currency_image_api_base_url,
            api_key=settings.currency_image_api_key,
            feeds=("note_images", "microprint_labels", "security_thread_labels", "uv_feature_labels", "serial_validation"),
            model_targets=("counterfeit_currency",),
        ),
    ]


def data_source_status() -> dict:
    sources = configured_sources()
    return {
        "ready_for_real_training": all(source.base_url and source.api_key for source in sources),
        "configured_count": sum(1 for source in sources if source.base_url and source.api_key),
        "required_count": len(sources),
        "sources": [source.status() for source in sources],
    }
