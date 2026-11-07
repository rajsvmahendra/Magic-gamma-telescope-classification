from fastapi import APIRouter, HTTPException, Path as PathParam
from app.services.statistics_service import statistics_service
from app.services.model_service import model_service
from app.schemas.responses import (
    ModelsListResponse,
    ModelMetricsResponse,
    ConfusionMatrixResponse
)

router = APIRouter(prefix="/models", tags=["Models & Evaluation"])

@router.get("", response_model=ModelsListResponse)
async def list_models():
    """
    Returns registered PySpark machine learning models, algorithms, required preprocessing,
    and associated hyperparameters.
    """
    return statistics_service.get_models_list()

@router.get("/metrics", response_model=ModelMetricsResponse)
async def get_model_metrics():
    """
    Returns the verified academic benchmark metrics for both Logistic Regression and Random Forest
    evaluated over the identical 3,742 test instances.
    """
    return statistics_service.get_metrics()

@router.get("/random_forest/feature-importance")
async def get_random_forest_feature_importance():
    """
    Returns authentic Gini feature importances extracted directly from
    the trained PySpark RandomForestClassificationModel.
    """
    try:
        features = model_service.get_rf_feature_importances()
        return {
            "model": "random_forest",
            "features": features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{model_name}/confusion-matrix", response_model=ConfusionMatrixResponse)
async def get_confusion_matrix(
    model_name: str = PathParam(..., description="Model identifier: 'random_forest' or 'logistic_regression'")
):
    """
    Returns the verified 2x2 confusion matrix with quadrant breakdowns, cell descriptions,
    and false alarm counts.
    """
    try:
        return statistics_service.get_confusion_matrix(model_name)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
