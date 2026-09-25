"""Run predictions using trained sklearn pipelines."""

from typing import Any

import pandas as pd

from utils.model_loader import get_features, get_model


def _risk_label(probability: float) -> str:
    percentage = round(probability * 100, 1)
    if percentage < 34:
        return "Low"
    if percentage <= 66:
        return "Moderate"
    return "High"


def _risk_level(probability: float) -> str:
    percentage = probability * 100
    if percentage < 34:
        return "low"
    if percentage <= 66:
        return "medium"
    return "high"


def _build_dataframe(features: list[str], payload: dict[str, Any]) -> pd.DataFrame:
    row = {}

    for feature in features:
        value = payload.get(feature)

        if value is None or value == "":
            row[feature] = float("nan")
        else:
            row[feature] = value

    return pd.DataFrame([row], columns=features)


def predict_disease(disease: str, payload: dict[str, Any]) -> dict[str, Any]:
    features = get_features(disease)
    model = get_model(disease)

    dataframe = _build_dataframe(features, payload)
    prediction = int(model.predict(dataframe)[0])

    probability = None
    probability_positive = None

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(dataframe)[0]
        probability_positive = float(proba[1])
        probability = round(probability_positive * 100, 1)

    return {
        "disease": disease,
        "prediction": prediction,
        "label": "positive" if prediction == 1 else "negative",
        "probability": probability,
        "probabilityPositive": probability_positive,
        "riskLevel": _risk_level(probability_positive or 0.0),
        "riskLabel": _risk_label(probability_positive or 0.0),
        "featuresUsed": features,
    }
