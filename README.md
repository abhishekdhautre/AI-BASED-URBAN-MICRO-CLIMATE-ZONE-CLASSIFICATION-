# Urban Micro-Climate & Heat Mapping

A full-stack web application for Local Climate Zone (LCZ) classification using a trained TensorFlow/Keras model on Sentinel-1 + Sentinel-2 satellite imagery.

## Project Structure

```
urban-heatmap/
├── frontend/          # React + Vite + Tailwind CSS
└── backend/           # Python + FastAPI + TensorFlow
    ├── app/
    │   ├── main.py            # FastAPI app + CORS + lifespan
    │   ├── model.py           # Model loader (loads once at startup)
    │   ├── preprocessing.py   # ⚙️  Input validation & normalization
    │   ├── schemas.py         # Pydantic request/response models
    │   ├── routes/
    │   │   ├── prediction.py  # POST /predict
    │   │   └── health.py      # GET /health
    │   └── utils/
    │       └── lcz_classes.py # LCZ class name mapping
    ├── models/
    │   └── model.h5           # ← Place your trained model here
    └── requirements.txt
```

---

## Setup

### 1. Add your trained model

```
cp /path/to/your/model.h5 backend/models/model.h5
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env if needed (MODEL_PATH, CORS_ORIGINS, INPUT_CHANNELS, NORMALIZATION)

# Start server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: http://localhost:5173

---

## ML Configuration

Before running predictions, open `backend/app/preprocessing.py` and configure:

| Variable | Description | Default |
|---|---|---|
| `INPUT_CHANNELS` | Total channels expected by model | `18` |
| `INPUT_HEIGHT` / `INPUT_WIDTH` | Spatial patch size | `32` |
| `NORMALIZATION` | `"minmax"`, `"zscore"`, or `"none"` | `"minmax"` |
| `CHANNEL_MEANS` / `CHANNEL_STDS` | Per-channel stats for z-score norm | `None` |
| `CHANNEL_MINS` / `CHANNEL_MAXS` | Per-channel stats for min-max norm | `None` |

Also verify `backend/app/utils/lcz_classes.py` — the class index order must match your training label encoding.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | API and model status |
| `POST` | `/predict` | Upload satellite patch, get LCZ prediction |

### POST /predict

Accepts: `multipart/form-data` with field `file`

Supported formats:
- `.tif` / `.tiff` — multi-band GeoTIFF (must have exactly `INPUT_CHANNELS` bands)
- `.npy` — NumPy array of shape `(H, W, C)` or `(1, H, W, C)`

**Standard RGB images (.jpg, .png) are rejected** — the model requires real multi-channel satellite data.

Example response:
```json
{
  "predicted_class": "LCZ 6",
  "class_name": "Open Low-Rise",
  "class_id": 5,
  "confidence": 0.914,
  "top_predictions": [
    { "predicted_class": "LCZ 6", "class_name": "Open Low-Rise", "probability": 0.914 },
    { "predicted_class": "LCZ 5", "class_name": "Open Mid-Rise",  "probability": 0.058 },
    { "predicted_class": "LCZ 9", "class_name": "Sparsely Built", "probability": 0.019 }
  ],
  "all_probabilities": [...],
  "input_info": { "filename": "patch.npy", "file_size_kb": 72.0, "tensor_shape": [1, 32, 32, 18] }
}
```

---

## Dataset

**So2Sat-LCZ42** — Zhu et al. (2020)
- 17 LCZ classes across 42 global cities
- Sentinel-1 SAR (4 channels) + Sentinel-2 MSI (14 channels)
- 32×32 pixel patches

---

## Notes

- Model performance metrics are placeholders in the UI. Add actual values from your training logs in `frontend/src/pages/ModelInfo.jsx`.
- The interactive map uses mock sample points. Connect real GeoTIFF/GeoJSON layers via WMS/WFS for production.
- Heat analysis charts use illustrative sample data. Replace with real Pune LST data in `frontend/src/data/lczData.js`.
