from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.services.dataset_service import dataset_service
from app.schemas.responses import DatasetInfoResponse, DatasetStatisticsResponse

router = APIRouter(prefix="/dataset", tags=["Dataset"])

@router.get("/info", response_model=DatasetInfoResponse)
async def get_dataset_info():
    """
    Returns authentic information about the UCI MAGIC Gamma Telescope dataset:
    dimensions, record count, feature attributes, and missing-value statistics.
    """
    return dataset_service.get_info()

@router.get("/statistics", response_model=DatasetStatisticsResponse)
async def get_dataset_statistics():
    """
    Returns empirical statistical metrics (min, max, mean, stddev) for all 10 features
    and true class distribution counts.
    """
    return dataset_service.get_statistics()

@router.get("/samples", response_model=List[Dict[str, Any]])
async def get_sample_events():
    """
    Returns authentic cosmic ray events extracted directly from magic04.data,
    including confirmed Gamma signals and Hadron background cascades.
    """
    return dataset_service.get_samples()

@router.get("/features/distributions", response_model=Dict[str, Any])
async def get_all_feature_distributions():
    """
    Returns ground-truth class-separated (Gamma vs Hadron) distribution metrics and
    histograms for all 10 features computed across all 19,020 authentic records.
    """
    return dataset_service.get_all_feature_distributions()

@router.get("/features/{feature_name}/distribution", response_model=Dict[str, Any])
async def get_feature_distribution(feature_name: str):
    """
    Returns ground-truth class-separated distribution and histogram for a specific Hillas feature.
    """
    dist = dataset_service.get_feature_distribution(feature_name)
    if not dist:
        raise HTTPException(status_code=404, detail=f"Feature '{feature_name}' not found.")
    return dist

