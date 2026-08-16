from fastapi import APIRouter
from app.schemas import HealthResponse
from app import model as model_manager
from app.utils.lcz_classes import NUM_CLASSES

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Return API and model status."""
    loaded = model_manager.is_loaded()
    input_shape = model_manager.get_model_input_shape()
    return HealthResponse(
        status="ok",
        model_loaded=loaded,
        model_path=model_manager._model_path,
        input_shape=str(input_shape) if input_shape else None,
        num_classes=NUM_CLASSES,
        message="Model ready for inference." if loaded else (
            "Model not loaded. Place model.h5 in backend/models/ and restart."
        ),
    )
