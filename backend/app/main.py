import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app import model as model_manager
from app.routes import prediction, health

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s — %(name)s — %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading model…")
    model_manager.load_model()
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="Urban Micro-Climate & Heat Mapping API",
    description=(
        "FastAPI backend for LCZ classification using a trained TensorFlow/Keras model. "
        "Accepts multi-band Sentinel-1 + Sentinel-2 satellite patches and returns "
        "Local Climate Zone predictions."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in _origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(prediction.router)


@app.get("/", include_in_schema=False)
def root():
    return {"message": "Urban Heat Mapping API — visit /docs for Swagger UI"}
