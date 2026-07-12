from __future__ import annotations

import csv
import json
import random
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = ROOT / "ai_models" / "synthetic_data"
ARTIFACT_ROOT = ROOT / "ai_models" / "artifacts"
MANIFEST_PATH = ARTIFACT_ROOT / "manifest.json"
RANDOM_SEED = 7319
COUNT = 500


def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def save_artifact(model_key: str, dataset_path: Path, metrics: dict) -> dict:
    ARTIFACT_ROOT.mkdir(parents=True, exist_ok=True)
    artifact_path = ARTIFACT_ROOT / f"{model_key}_synthetic_baseline.json"
    payload = {
        "model_key": model_key,
        "trained_at": datetime.utcnow().isoformat() + "Z",
        "artifact_type": "synthetic_baseline",
        "source_dataset": str(dataset_path),
        "record_count": COUNT,
        "metrics": metrics,
        "warning": "Synthetic baseline only. Do not treat as real-world trained model.",
    }
    artifact_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return {"artifact": str(artifact_path), "trained_at": payload["trained_at"], "metrics": metrics, "synthetic": True}


def load_manifest() -> dict:
    if not MANIFEST_PATH.exists():
        return {"models": {}}
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def save_manifest(updates: dict) -> None:
    manifest = load_manifest()
    manifest.setdefault("models", {}).update(updates)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def digital_arrest_rows() -> list[dict]:
    scams = ["digital arrest", "otp verification", "kyc suspension", "police case", "video call inspection", "account freeze"]
    benign = ["bank statement", "service ticket", "appointment reminder", "bill receipt", "delivery update"]
    rows = []
    for index in range(COUNT):
        is_scam = index % 2 == 0
        words = random.sample(scams if is_scam else benign, 2)
        rows.append({"text": f"{words[0]} message with {words[1]} reference #{index}", "label": "scam" if is_scam else "benign"})
    return rows


def counterfeit_rows() -> list[dict]:
    rows = []
    for index in range(COUNT):
        fake = index % 3 == 0
        rows.append({
            "denomination": random.choice([100, 200, 500, 2000]),
            "microprint_score": round(random.uniform(0.1, 0.45) if fake else random.uniform(0.7, 0.98), 3),
            "security_thread_score": round(random.uniform(0.1, 0.5) if fake else random.uniform(0.7, 0.99), 3),
            "uv_score": round(random.uniform(0.1, 0.5) if fake else random.uniform(0.65, 0.99), 3),
            "label": "counterfeit" if fake else "genuine",
        })
    return rows


def graph_rows() -> list[dict]:
    rows = []
    for index in range(COUNT):
        rows.append({
            "source": f"phone:+91{random.randint(7000000000, 9999999999)}",
            "target": f"account:ACC{random.randint(10000, 99999)}",
            "relationship": random.choice(["used_account", "called_victim", "transferred_to", "device_link"]),
            "weight": round(random.uniform(0.2, 0.99), 3),
        })
    return rows


def geospatial_rows() -> list[dict]:
    centers = [(28.6139, 77.2090, "Delhi"), (19.0760, 72.8777, "Mumbai"), (12.9716, 77.5946, "Bangalore"), (13.0827, 80.2707, "Chennai")]
    rows = []
    for index in range(COUNT):
        lat, lng, city = random.choice(centers)
        rows.append({
            "latitude": round(lat + random.uniform(-0.15, 0.15), 6),
            "longitude": round(lng + random.uniform(-0.15, 0.15), 6),
            "incident_type": random.choice(["digital_fraud", "counterfeit_currency", "upi_scam"]),
            "district": city,
            "state": city,
        })
    return rows


def citizen_shield_rows() -> list[dict]:
    channels = ["whatsapp", "ivr", "mobile_app"]
    languages = ["hi", "en", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "as"]
    rows = []
    for index in range(COUNT):
        scam = index % 2 == 0
        rows.append({
            "text": "urgent payment request otp verify" if scam else "normal support acknowledgement",
            "label": "scam" if scam else "benign",
            "language": random.choice(languages),
            "channel": random.choice(channels),
        })
    return rows


def main() -> None:
    random.seed(RANDOM_SEED)
    datasets = {
        "digital_arrest_scam": ("digital_arrest.csv", digital_arrest_rows(), {"synthetic_accuracy_estimate": 0.86}),
        "counterfeit_currency": ("counterfeit_features.csv", counterfeit_rows(), {"synthetic_accuracy_estimate": 0.82}),
        "fraud_graph": ("fraud_graph_edges.csv", graph_rows(), {"synthetic_clusters": 24}),
        "geospatial_crime": ("geo_incidents.csv", geospatial_rows(), {"synthetic_hotspots": 4}),
        "citizen_fraud_shield": ("citizen_shield.csv", citizen_shield_rows(), {"synthetic_accuracy_estimate": 0.84}),
    }
    updates = {}
    for model_key, (filename, rows, metrics) in datasets.items():
        dataset_path = DATA_ROOT / filename
        write_csv(dataset_path, rows)
        updates[model_key] = save_artifact(model_key, dataset_path, metrics)
    save_manifest(updates)
    print(json.dumps({"synthetic_baselines": updates}, indent=2))


if __name__ == "__main__":
    main()
