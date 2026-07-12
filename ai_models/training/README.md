# AI Training

SentinelAI exposes five AI capability slots in the backend. Real training requires real, licensed datasets and optional heavy AI dependencies.

## Models

- Digital Arrest Scam Detection & Alerting: NLP classifier for scam scripts, call-flow text, and alert decisions.
- Counterfeit Currency Identification Agent: YOLOv8n/OpenCV computer vision detector for counterfeit note features.
- Fraud Network Graph Intelligence: graph analytics over accounts, devices, phones, transactions, and victim reports.
- Geospatial Crime Pattern Intelligence: hotspot clustering over complaint/seizure geocodes.
- Citizen Fraud Shield: multilingual NLP classifier for WhatsApp, IVR, and mobile-app messages.

## Install Training Dependencies

```powershell
cd E:\Sentinel-AI
python -m pip install -r requirements-ai.txt
```

## Dataset Contracts

See `ai_models/training/DATASETS.md`.

## Train All Models

```powershell
python ai_models\training\train_all.py `
  --digital-arrest-data E:\datasets\digital_arrest.csv `
  --counterfeit-data E:\datasets\counterfeit_notes\data.yaml `
  --fraud-graph-data E:\datasets\fraud_graph_edges.csv `
  --geospatial-data E:\datasets\geo_incidents.csv `
  --citizen-shield-data E:\datasets\citizen_shield.csv
```

Training writes artifacts to `ai_models/artifacts/` and the backend reports trained status at `/api/v1/intelligence/models/status`.
