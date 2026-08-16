"""
Model loader — loads the .h5 model once at startup and reuses it for all requests.
"""

import os
import logging
from pathlib import Path
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)

_model = None
_model_path: Optional[str] = None


def load_model() -> None:
    """Load the Keras model from disk. Called once at application startup."""
    global _model, _model_path

    model_path = os.getenv("MODEL_PATH", "models/model.h5")
    path = Path(model_path)

    if not path.exists():
        logger.warning(
            f"Model file not found at '{model_path}'. "
            "Place your trained .h5 file at backend/models/model.h5 "
            "or set the MODEL_PATH environment variable."
        )
        return

    try:
        # Import TensorFlow lazily to avoid slow startup when model is missing
        import tensorflow as tf
        _model = tf.keras.models.load_model(str(path), compile=False)
        _model_path = str(path)
        logger.info(f"Model loaded from '{path}' — input shape: {_model.input_shape}")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        _model = None


def get_model():
    return _model


def is_loaded() -> bool:
    return _model is not None


def get_model_input_shape() -> Optional[tuple]:
    if _model is None:
        return None
    return tuple(_model.input_shape)


def predict(tensor: np.ndarray) -> np.ndarray:
    """
    Run inference on a preprocessed tensor.

    Args:
        tensor: np.ndarray of shape (1, H, W, C)

    Returns:
        np.ndarray of shape (num_classes,) — class probabilities
    """
    if _model is None:
        raise RuntimeError("Model is not loaded.")
    probs = _model.predict(tensor, verbose=0)
    return probs[0]  # (num_classes,)
