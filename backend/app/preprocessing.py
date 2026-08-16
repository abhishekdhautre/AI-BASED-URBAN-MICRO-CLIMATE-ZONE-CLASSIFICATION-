"""
Preprocessing module for satellite patch input.

IMPORTANT: This module contains clearly marked configuration points.
You MUST update these to match your exact training preprocessing pipeline.
Do NOT silently convert incompatible inputs — raise explicit errors instead.
"""

import os
import io
import numpy as np
from PIL import Image
from fastapi import HTTPException

# ── Configuration ────────────────────────────────────────────────────────────
# These values must match your training pipeline exactly.

INPUT_HEIGHT: int = int(os.getenv("INPUT_HEIGHT", 32))
INPUT_WIDTH: int = int(os.getenv("INPUT_WIDTH", 32))
INPUT_CHANNELS: int = int(os.getenv("INPUT_CHANNELS", 18))
NORMALIZATION: str = os.getenv("NORMALIZATION", "minmax")  # "minmax" | "zscore" | "none"

# Per-channel statistics — fill these from your training dataset statistics.
# Used when NORMALIZATION = "zscore"
# Shape: (INPUT_CHANNELS,)
CHANNEL_MEANS: list[float] | None = None   # e.g. [0.12, 0.08, ...]
CHANNEL_STDS: list[float] | None = None    # e.g. [0.05, 0.03, ...]

# Per-channel min/max — fill from your training dataset.
# Used when NORMALIZATION = "minmax"
CHANNEL_MINS: list[float] | None = None    # e.g. [-25.0, -30.0, ...]
CHANNEL_MAXS: list[float] | None = None    # e.g. [5.0, 0.0, ...]

EXPECTED_SHAPE = (INPUT_HEIGHT, INPUT_WIDTH, INPUT_CHANNELS)

# ── Normalization ─────────────────────────────────────────────────────────────

def _normalize(array: np.ndarray) -> np.ndarray:
    """
    Apply normalization to a (H, W, C) array.
    Update this function to match your training normalization exactly.
    """
    if NORMALIZATION == "minmax":
        if CHANNEL_MINS is not None and CHANNEL_MAXS is not None:
            mins = np.array(CHANNEL_MINS, dtype=np.float32)
            maxs = np.array(CHANNEL_MAXS, dtype=np.float32)
            denom = np.where(maxs - mins == 0, 1.0, maxs - mins)
            return (array - mins) / denom
        else:
            # Fallback: per-sample min-max (not ideal — replace with dataset stats)
            mn, mx = array.min(), array.max()
            return (array - mn) / (mx - mn + 1e-8)

    elif NORMALIZATION == "zscore":
        if CHANNEL_MEANS is not None and CHANNEL_STDS is not None:
            means = np.array(CHANNEL_MEANS, dtype=np.float32)
            stds = np.array(CHANNEL_STDS, dtype=np.float32)
            return (array - means) / (stds + 1e-8)
        else:
            return (array - array.mean()) / (array.std() + 1e-8)

    return array  # "none"


# ── File parsers ──────────────────────────────────────────────────────────────

def _load_npy(data: bytes) -> np.ndarray:
    """Load a .npy file containing a pre-stacked satellite patch."""
    try:
        arr = np.load(io.BytesIO(data), allow_pickle=False)
    except Exception as e:
        raise HTTPException(400, f"Failed to parse .npy file: {e}")
    return arr.astype(np.float32)


def _load_tiff(data: bytes) -> np.ndarray:
    """
    Load a multi-band GeoTIFF.
    Requires the file to have exactly INPUT_CHANNELS bands.
    """
    try:
        img = Image.open(io.BytesIO(data))
        frames = []
        for i in range(img.n_frames):
            img.seek(i)
            frames.append(np.array(img, dtype=np.float32))
        arr = np.stack(frames, axis=-1)  # (H, W, C)
    except Exception as e:
        raise HTTPException(400, f"Failed to parse TIFF file: {e}")
    return arr


def _reject_rgb(filename: str) -> None:
    """
    Reject plain RGB images with a clear error message.
    Never silently convert RGB to fake satellite channels.
    """
    raise HTTPException(
        422,
        detail=(
            f"'{filename}' appears to be a standard RGB image. "
            f"The model requires {INPUT_CHANNELS}-channel satellite data "
            f"(Sentinel-1 + Sentinel-2). "
            "Upload a multi-band GeoTIFF (.tif) or NumPy array (.npy) "
            "containing the correct channel stack."
        ),
    )


# ── Public API ────────────────────────────────────────────────────────────────

def preprocess(file_bytes: bytes, filename: str) -> np.ndarray:
    """
    Parse and preprocess an uploaded satellite patch.

    Returns:
        np.ndarray of shape (1, H, W, C) ready for model.predict()

    Raises:
        HTTPException 400/422 on invalid input.
    """
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    # Reject plain images immediately
    if ext in ("jpg", "jpeg", "png", "bmp", "webp"):
        _reject_rgb(filename)

    if ext == "npy":
        arr = _load_npy(file_bytes)
    elif ext in ("tif", "tiff"):
        arr = _load_tiff(file_bytes)
    else:
        raise HTTPException(400, f"Unsupported file type '.{ext}'. Use .tif, .tiff, or .npy")

    # Squeeze batch dim if present
    if arr.ndim == 4 and arr.shape[0] == 1:
        arr = arr[0]

    # Validate shape
    if arr.ndim != 3:
        raise HTTPException(400, f"Expected 3D array (H, W, C), got shape {arr.shape}")

    h, w, c = arr.shape

    if c != INPUT_CHANNELS:
        raise HTTPException(
            422,
            detail=(
                f"Channel mismatch: model expects {INPUT_CHANNELS} channels, "
                f"but input has {c} channels. "
                "Ensure your file contains the correct Sentinel-1 + Sentinel-2 channel stack."
            ),
        )

    if h != INPUT_HEIGHT or w != INPUT_WIDTH:
        raise HTTPException(
            422,
            detail=(
                f"Spatial dimension mismatch: model expects {INPUT_HEIGHT}×{INPUT_WIDTH} pixels, "
                f"but input is {h}×{w}. Resize or re-extract the patch."
            ),
        )

    arr = _normalize(arr)
    return arr[np.newaxis, ...]  # (1, H, W, C)
