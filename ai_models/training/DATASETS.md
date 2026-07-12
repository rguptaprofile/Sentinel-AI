# Real Dataset Contracts

The five SentinelAI models can only be genuinely trained when real, licensed datasets are provided. Do not put secrets or private citizen data in git.

## 1. Digital Arrest Scam Detection & Alerting

CSV path passed with `--digital-arrest-data`.

Required columns:

```csv
text,label
"Your Aadhaar is under digital arrest...",scam
"Normal bank service message...",benign
```

Recommended real sources:

- NCRP/NCRB or law-enforcement complaint exports
- Telecom call-flow metadata from approved providers
- Verified scam script templates from agency takedown reports

## 2. Counterfeit Currency Identification Agent

YOLO dataset YAML path passed with `--counterfeit-data`.

Expected structure:

```yaml
path: E:/datasets/counterfeit_notes
train: images/train
val: images/val
names:
  0: genuine_note
  1: counterfeit_note
  2: bad_security_thread
  3: bad_microprint
  4: suspicious_serial
```

Use controlled image captures from banks, field officers, counting machines, or lab-verified note datasets.

## 3. Fraud Network Graph Intelligence

CSV path passed with `--fraud-graph-data`.

Required columns:

```csv
source,target,relationship,weight
phone:+9198xxxx,account:ACC123,used_account,0.9
account:ACC123,upi:fraud@upi,transferred_to,0.8
```

Use sanctioned transaction metadata, call records, device fingerprints, mule-account links, and victim-report links.

## 4. Geospatial Crime Pattern Intelligence

CSV path passed with `--geospatial-data`.

Required columns:

```csv
latitude,longitude,incident_type,occurred_at,district,state
28.6139,77.2090,digital_fraud,2026-07-01T09:30:00,Delhi,Delhi
```

Use complaint geocodes, seizure points, cybercrime hotspots, and district-level patrol data.

## 5. Citizen Fraud Shield

CSV path passed with `--citizen-shield-data`.

Required columns:

```csv
text,label,language,channel
"OTP mat batana...",scam,hi,whatsapp
"Your bill receipt is attached.",benign,en,mobile_app
```

Use multilingual citizen reports, IVR transcripts, WhatsApp report exports, and mobile-app risk assessments.

## Training Command

```powershell
cd E:\Sentinel-AI
python -m pip install -r requirements-ai.txt
python ai_models\training\train_all.py `
  --digital-arrest-data E:\datasets\digital_arrest.csv `
  --counterfeit-data E:\datasets\counterfeit_notes\data.yaml `
  --fraud-graph-data E:\datasets\fraud_graph_edges.csv `
  --geospatial-data E:\datasets\geo_incidents.csv `
  --citizen-shield-data E:\datasets\citizen_shield.csv
```

Successful training writes artifacts under `ai_models/artifacts/` and updates `ai_models/artifacts/manifest.json`. Backend model status is available at:

```text
http://127.0.0.1:8000/api/v1/intelligence/models/status
```

## API Key Integration

Put official provider URLs and keys in the root `.env` file or your deployment secret manager:

```text
TELECOM_API_BASE_URL=
TELECOM_API_KEY=
MHA_ALERT_API_BASE_URL=
MHA_ALERT_API_KEY=
NCRB_API_BASE_URL=
NCRB_API_KEY=
WHATSAPP_API_BASE_URL=
WHATSAPP_API_KEY=
SPEECH_AI_API_BASE_URL=
SPEECH_AI_API_KEY=
GEOCODING_API_BASE_URL=
GEOCODING_API_KEY=
BANK_FRAUD_API_BASE_URL=
BANK_FRAUD_API_KEY=
CURRENCY_IMAGE_API_BASE_URL=
CURRENCY_IMAGE_API_KEY=
```

Check whether real data integrations are configured:

```text
http://127.0.0.1:8000/api/v1/intelligence/data-sources/status
http://127.0.0.1:8000/api/v1/intelligence/training/readiness
```

The backend will not pretend live training has happened until real datasets are present and artifacts are written to `ai_models/artifacts/manifest.json`.
