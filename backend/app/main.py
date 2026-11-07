import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.spark_session import get_spark_session, stop_spark_session
from app.services.model_service import model_service

from app.api.routes_health import router as health_router
from app.api.routes_dataset import router as dataset_router
from app.api.routes_models import router as models_router
from app.api.routes_predict import router as predict_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("magic_gamma_explorer")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the lifecycle of backend resources.
    Initializes singleton SparkSession, StandardScaler bridge, and Spark ML models on startup.
    Gracefully shuts down Spark on application exit.
    """
    logger.info("Initializing MAGIC Gamma Explorer backend...")
    try:
        # Pre-warm Spark and load ML artifacts
        spark = get_spark_session()
        model_service.initialize()
        logger.info("All Spark ML models and preprocessing bridges loaded successfully.")
    except Exception as e:
        logger.exception("Failed to initialize Spark ML models during startup: %s", e)

    yield

    logger.info("Gracefully shutting down backend services...")
    stop_spark_session()
    logger.info("Backend shutdown complete.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scientific REST API exposing verified Spark ML classification models for the UCI MAGIC Gamma Telescope dataset.",
    lifespan=lifespan
)

# CORS configuration for local React frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(dataset_router, prefix=settings.API_V1_PREFIX)
app.include_router(models_router, prefix=settings.API_V1_PREFIX)
app.include_router(predict_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_PREFIX
    }
