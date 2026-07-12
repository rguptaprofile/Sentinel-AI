from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "sentinelai"
    mongodb_timeout_ms: int = 5000
    telecom_api_base_url: str | None = None
    telecom_api_key: str | None = None
    mha_alert_api_base_url: str | None = None
    mha_alert_api_key: str | None = None
    ncrb_api_base_url: str | None = None
    ncrb_api_key: str | None = None
    whatsapp_api_base_url: str | None = None
    whatsapp_api_key: str | None = None
    speech_ai_api_base_url: str | None = None
    speech_ai_api_key: str | None = None
    geocoding_api_base_url: str | None = None
    geocoding_api_key: str | None = None
    bank_fraud_api_base_url: str | None = None
    bank_fraud_api_key: str | None = None
    currency_image_api_base_url: str | None = None
    currency_image_api_key: str | None = None
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://sentinel-in.vercel.app",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
