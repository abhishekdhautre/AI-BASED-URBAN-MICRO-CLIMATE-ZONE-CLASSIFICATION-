from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class TopPrediction(BaseModel):
    class_id: int
    class_name: str
    predicted_class: str
    probability: float


class PredictionResponse(BaseModel):
    predicted_class: str
    class_name: str
    class_id: int
    confidence: float
    top_predictions: List[TopPrediction]
    all_probabilities: List[float]
    input_info: Dict[str, Any]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_path: Optional[str]
    input_shape: Optional[str]
    num_classes: int
    message: str
