import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas import PredictionResponse, TopPrediction
from app import model as model_manager
from app.preprocessing import preprocess
from app.utils.lcz_classes import LCZ_CLASS_NAMES, LCZ_CLASS_DISPLAY_NAMES

router = APIRouter()

TOP_K = 3


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict_lcz(file: UploadFile = File(..., description="Multi-band satellite patch (.tif or .npy)")):
    """
    Classify a satellite patch into one of 17 Local Climate Zone classes.

    Accepts:
    - `.tif` / `.tiff` — multi-band GeoTIFF with exactly INPUT_CHANNELS bands
    - `.npy` — NumPy array of shape (H, W, C) or (1, H, W, C)

    Returns predicted LCZ class, confidence, and top-3 predictions.
    """
    if not model_manager.is_loaded():
        raise HTTPException(
            503,
            detail="Model is not loaded. Place model.h5 in backend/models/ and restart the server.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(400, "Uploaded file is empty.")

    # Preprocess — raises HTTPException on invalid input
    tensor = preprocess(file_bytes, file.filename or "upload")

    # Inference
    try:
        probs = model_manager.predict(tensor)  # (num_classes,)
    except Exception as e:
        raise HTTPException(500, f"Inference error: {e}")

    probs = probs.astype(float)
    top_indices = np.argsort(probs)[::-1]

    predicted_idx = int(top_indices[0])
    predicted_code = LCZ_CLASS_NAMES[predicted_idx]
    predicted_name = LCZ_CLASS_DISPLAY_NAMES[predicted_code]

    top_predictions = [
        TopPrediction(
            class_id=int(i),
            class_name=LCZ_CLASS_DISPLAY_NAMES[LCZ_CLASS_NAMES[i]],
            predicted_class=LCZ_CLASS_NAMES[i],
            probability=round(float(probs[i]), 6),
        )
        for i in top_indices[:TOP_K]
    ]

    return PredictionResponse(
        predicted_class=predicted_code,
        class_name=predicted_name,
        class_id=predicted_idx,
        confidence=round(float(probs[predicted_idx]), 6),
        top_predictions=top_predictions,
        all_probabilities=[round(float(p), 6) for p in probs],
        input_info={
            "filename": file.filename,
            "file_size_kb": round(len(file_bytes) / 1024, 2),
            "tensor_shape": list(tensor.shape),
        },
    )
