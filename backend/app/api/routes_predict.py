import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.features import HillasFeaturesInput
from app.schemas.responses import PredictionResult
from app.services.model_service import model_service

logger = logging.getLogger("magic_gamma_explorer.api.predict")

router = APIRouter(prefix="/predict", tags=["Inference"])

@router.post("/random-forest", response_model=PredictionResult)
async def predict_random_forest(features: HillasFeaturesInput):
    """
    Classifies a high-energy shower event using the trained PySpark Random Forest model (100 trees).
    Uses unscaled assembled Hillas parameters.
    """
    try:
        feature_list = features.to_ordered_list()
        result = model_service.predict_random_forest(feature_list)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid feature inputs: {ve}"
        )
    except RuntimeError as re:
        logger.error("Model runtime error during Random Forest prediction: %s", re)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Random Forest model service is currently unavailable."
        )
    except Exception as e:
        logger.exception("Unexpected inference error in Random Forest: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during PySpark inference."
        )

@router.post("/logistic-regression", response_model=PredictionResult)
async def predict_logistic_regression(features: HillasFeaturesInput):
    """
    Classifies a high-energy shower event using the trained PySpark Logistic Regression model.
    Applies the exact training-time StandardScaler transformation bridge before inference.
    """
    try:
        feature_list = features.to_ordered_list()
        result = model_service.predict_logistic_regression(feature_list)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid feature inputs: {ve}"
        )
    except RuntimeError as re:
        logger.error("Model runtime error during Logistic Regression prediction: %s", re)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Logistic Regression model service is currently unavailable."
        )
    except Exception as e:
        logger.exception("Unexpected inference error in Logistic Regression: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during PySpark inference."
        )
