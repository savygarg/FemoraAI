"""Load trained model artifacts once at startup."""

from pathlib import Path
import joblib

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

_MODEL_CACHE = {}
 

def _load_artifact(name: str):
    if name not in _MODEL_CACHE:
        path = MODELS_DIR / name
        if not path.exists():
            raise FileNotFoundError(f"Model artifact not found: {path}")
        _MODEL_CACHE[name] = joblib.load(path)
    return _MODEL_CACHE[name]


def get_features(disease: str) -> list:
    return _load_artifact(f"{disease}_features.pkl")


def get_model(disease: str):
    return _load_artifact(f"{disease}_model.pkl")


def get_metadata():
    return _load_artifact("metadata.pkl")


def preload_models():
    for disease in ("pcos", "diabetes", "thyroid"):
        get_features(disease)
        get_model(disease)
    get_metadata()
