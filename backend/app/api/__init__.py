"""
API Routers Package.
"""
from .routes_health import router as health_router
from .routes_dataset import router as dataset_router
from .routes_models import router as models_router
from .routes_predict import router as predict_router

__all__ = ["health_router", "dataset_router", "models_router", "predict_router"]
