from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    spark_connected: bool
    spark_version: Optional[str] = None
    models_loaded: Dict[str, bool]

class DatasetInfoResponse(BaseModel):
    dataset_name: str
    source: str
    origin: str
    total_records: int
    number_of_features: int
    feature_names: List[str]
    missing_values: int
    target_classes: Dict[str, Any]

class FeatureStatistic(BaseModel):
    name: str
    display_name: str
    unit: str
    description: str
    min: float
    max: float
    mean: float
    stddev: float

class DatasetStatisticsResponse(BaseModel):
    total_records: int
    features: List[FeatureStatistic]
    class_distribution: Dict[str, Any]

class EvaluationMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float

class ModelDetail(BaseModel):
    model_name: str
    algorithm: str
    required_feature_column: str
    requires_scaling: bool
    hyperparameters: Dict[str, Any]
    evaluation_metrics: EvaluationMetrics

class ModelsListResponse(BaseModel):
    engine: str
    pyspark_version: str
    models: List[ModelDetail]

class ModelMetricsResponse(BaseModel):
    logistic_regression: EvaluationMetrics
    random_forest: EvaluationMetrics
    source: str

class ConfusionMatrixCell(BaseModel):
    actual: str
    predicted: str
    count: int
    description: str

class ConfusionMatrixResponse(BaseModel):
    model_name: str
    test_set_size: int
    matrix: Dict[str, int]
    breakdown: List[ConfusionMatrixCell]
    labels: Dict[str, str]

class PredictionProbability(BaseModel):
    gamma: float
    hadron: float

class PredictionResult(BaseModel):
    model: str
    prediction: str
    prediction_index: int
    probability: PredictionProbability
    is_signal: bool
    confidence: float
    raw_probabilities: Optional[List[float]] = None
