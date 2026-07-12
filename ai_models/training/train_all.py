from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = ROOT / "ai_models" / "artifacts"
MANIFEST_PATH = ARTIFACT_ROOT / "manifest.json"


def _require_file(path: str | None, label: str) -> Path:
    if not path:
        raise SystemExit(f"Missing dataset path for {label}. Pass --{label.replace('_', '-')}-data.")
    resolved = Path(path).resolve()
    if not resolved.exists():
        raise SystemExit(f"Dataset not found for {label}: {resolved}")
    return resolved


def _write_artifact(model_key: str, source: Path, metrics: dict) -> dict:
    ARTIFACT_ROOT.mkdir(parents=True, exist_ok=True)
    artifact_path = ARTIFACT_ROOT / f"{model_key}.json"
    artifact = {
        "model_key": model_key,
        "source_dataset": str(source),
        "trained_at": datetime.utcnow().isoformat() + "Z",
        "metrics": metrics,
        "note": "Training metadata exported. Replace this JSON with binary weights when using heavy ML frameworks.",
    }
    artifact_path.write_text(json.dumps(artifact, indent=2), encoding="utf-8")
    return {"artifact": str(artifact_path), "trained_at": artifact["trained_at"], "metrics": metrics}


def _load_manifest() -> dict:
    if not MANIFEST_PATH.exists():
        return {"models": {}}
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def _save_manifest(updates: dict) -> None:
    manifest = _load_manifest()
    manifest.setdefault("models", {}).update(updates)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def train_text_classifier(data: Path, model_key: str) -> dict:
    import pandas as pd
    from joblib import dump
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import accuracy_score, f1_score
    from sklearn.model_selection import train_test_split
    from sklearn.pipeline import Pipeline

    frame = pd.read_csv(data)
    if not {"text", "label"}.issubset(frame.columns):
        raise SystemExit(f"{data} must contain text,label columns.")
    train_x, test_x, train_y, test_y = train_test_split(frame["text"], frame["label"], test_size=0.2, random_state=42, stratify=frame["label"])
    pipeline = Pipeline([("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=2)), ("clf", LogisticRegression(max_iter=1000))])
    pipeline.fit(train_x, train_y)
    predictions = pipeline.predict(test_x)
    metrics = {"accuracy": round(float(accuracy_score(test_y, predictions)), 4), "f1_weighted": round(float(f1_score(test_y, predictions, average="weighted")), 4)}
    ARTIFACT_ROOT.mkdir(parents=True, exist_ok=True)
    model_path = ARTIFACT_ROOT / f"{model_key}.joblib"
    dump(pipeline, model_path)
    return {"artifact": str(model_path), "trained_at": datetime.utcnow().isoformat() + "Z", "metrics": metrics}


def train_counterfeit_detector(data: Path) -> dict:
    try:
        from ultralytics import YOLO
    except ImportError as exc:
        raise SystemExit("Install AI deps first: python -m pip install -r requirements-ai.txt") from exc

    model = YOLO("yolov8n.pt")
    results = model.train(data=str(data), epochs=25, imgsz=640, project=str(ARTIFACT_ROOT), name="counterfeit_currency_yolov8n", exist_ok=True)
    weights = Path(results.save_dir) / "weights" / "best.pt"
    return {"artifact": str(weights), "trained_at": datetime.utcnow().isoformat() + "Z", "metrics": {"framework": "ultralytics_yolov8n"}}


def train_graph_model(data: Path) -> dict:
    import networkx as nx
    import pandas as pd

    edges = pd.read_csv(data)
    if not {"source", "target"}.issubset(edges.columns):
        raise SystemExit(f"{data} must contain source,target columns.")
    graph = nx.from_pandas_edgelist(edges, source="source", target="target")
    metrics = {
        "nodes": graph.number_of_nodes(),
        "edges": graph.number_of_edges(),
        "connected_components": nx.number_connected_components(graph.to_undirected()),
    }
    return _write_artifact("fraud_graph", data, metrics)


def train_geospatial_model(data: Path) -> dict:
    import pandas as pd
    from sklearn.cluster import DBSCAN

    frame = pd.read_csv(data)
    if not {"latitude", "longitude"}.issubset(frame.columns):
        raise SystemExit(f"{data} must contain latitude,longitude columns.")
    coords = frame[["latitude", "longitude"]].dropna()
    clusters = DBSCAN(eps=0.15, min_samples=3).fit(coords)
    metrics = {"records": len(coords), "clusters": len(set(clusters.labels_) - {-1}), "noise_points": int((clusters.labels_ == -1).sum())}
    return _write_artifact("geospatial_crime", data, metrics)


def main() -> None:
    parser = argparse.ArgumentParser(description="Train SentinelAI model artifacts from real datasets.")
    parser.add_argument("--digital-arrest-data", help="CSV with text,label columns for digital arrest scam classification.")
    parser.add_argument("--counterfeit-data", help="YOLO dataset YAML for counterfeit note detection.")
    parser.add_argument("--fraud-graph-data", help="CSV with source,target columns for fraud graph intelligence.")
    parser.add_argument("--geospatial-data", help="CSV with latitude,longitude columns for hotspot clustering.")
    parser.add_argument("--citizen-shield-data", help="CSV with text,label columns for multi-channel citizen fraud shield.")
    args = parser.parse_args()

    updates = {}
    updates["digital_arrest_scam"] = train_text_classifier(_require_file(args.digital_arrest_data, "digital_arrest"), "digital_arrest_scam")
    updates["counterfeit_currency"] = train_counterfeit_detector(_require_file(args.counterfeit_data, "counterfeit"))
    updates["fraud_graph"] = train_graph_model(_require_file(args.fraud_graph_data, "fraud_graph"))
    updates["geospatial_crime"] = train_geospatial_model(_require_file(args.geospatial_data, "geospatial"))
    updates["citizen_fraud_shield"] = train_text_classifier(_require_file(args.citizen_shield_data, "citizen_shield"), "citizen_fraud_shield")
    _save_manifest(updates)
    print(json.dumps({"trained": updates}, indent=2))


if __name__ == "__main__":
    main()
