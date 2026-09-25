from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from prediction.predictor import predict_disease
from utils.model_loader import get_features, get_metadata, preload_models

app = FastAPI(title="FemoraAI AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    preload_models()


@app.get("/")
def root():
    return {"success": True, "message": "FemoraAI AI Service is running"}


@app.get("/health")
def health():
    return {"success": True, "message": "AI service is healthy"}


@app.get("/models/metadata")
def models_metadata():
    metadata = get_metadata()
    return {"success": True, "metadata": metadata}


class PredictionRequest(BaseModel):
    features: dict = Field(..., description="Model input keyed by exact feature names")


def _handle_prediction(disease: str, request: PredictionRequest):
    try:
        result = predict_disease(disease, request.features)
        return {"success": True, "result": result}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed for {disease}: {error}",
        ) from error


@app.post("/predict/pcos")
def predict_pcos(request: PredictionRequest):
    return _handle_prediction("pcos", request)


@app.post("/predict/diabetes")
def predict_diabetes(request: PredictionRequest):
    return _handle_prediction("diabetes", request)


@app.post("/predict/thyroid")
def predict_thyroid(request: PredictionRequest):
    return _handle_prediction("thyroid", request)


@app.get("/features/{disease}")
def feature_schema(disease: str):
    if disease not in {"pcos", "diabetes", "thyroid"}:
        raise HTTPException(status_code=404, detail="Unknown disease model")

    return {
        "success": True,
        "disease": disease,
        "features": get_features(disease),
    }
