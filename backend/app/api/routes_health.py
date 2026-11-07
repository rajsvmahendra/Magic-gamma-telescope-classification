from fastapi import APIRouter
from app.core.config import settings
from app.core.spark_session import get_spark_session
from app.services.model_service import model_service
from app.schemas.responses import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Returns API health status, active SparkSession version, and ML model readiness.
    """
    spark_ok = False
    spark_ver = None
    try:
        spark = get_spark_session()
        spark_ok = spark is not None and spark._jsc is not None
        if spark_ok:
            spark_ver = spark.version
    except Exception:
        spark_ok = False

    models_status = model_service.get_status()

    return HealthResponse(
        status="ok",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        spark_connected=spark_ok,
        spark_version=spark_ver,
        models_loaded=models_status
    )
