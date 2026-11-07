import json
import logging
from typing import Optional, List
from pyspark.sql import DataFrame, SparkSession
from pyspark.ml.feature import StandardScaler, StandardScalerModel, VectorAssembler, StringIndexer
from pyspark.ml.linalg import Vectors, Vector
from app.core.config import settings

logger = logging.getLogger("magic_gamma_explorer.scaler")

class ScalerService:
    """
    Reproduces the exact training-time StandardScaler transformation for Logistic Regression.
    The academic project fitted StandardScaler(withMean=True, withStd=True) on train_df
    (derived from magic04.data with randomSplit([0.8, 0.2], seed=42)).
    This service deterministically recreates and caches that exact StandardScalerModel.
    """
    def __init__(self):
        self._scaler_model: Optional[StandardScalerModel] = None
        self._mean_vector: Optional[List[float]] = None
        self._std_vector: Optional[List[float]] = None
        self.stats_file = settings.PRODUCT_ML_ARTIFACTS_DIR / "training_statistics.json"

    def initialize(self, spark: SparkSession) -> None:
        """
        Fits or loads the deterministic StandardScalerModel on train_df.
        """
        if self._scaler_model is not None:
            return

        logger.info("Initializing StandardScaler transformation bridge for Logistic Regression...")
        
        # Read the raw academic dataset (read-only)
        raw_df = spark.read.csv(
            str(settings.RAW_DATA_PATH),
            header=False,
            inferSchema=True
        )
        
        column_names = settings.FEATURE_NAMES + ["class"]
        df = raw_df.toDF(*column_names)
        
        # Apply identical StringIndexer & VectorAssembler from academic pipeline
        indexer = StringIndexer(inputCol="class", outputCol="label")
        df_labeled = indexer.fit(df).transform(df)
        
        assembler = VectorAssembler(
            inputCols=settings.FEATURE_NAMES,
            outputCol="features"
        )
        df_ml = assembler.transform(df_labeled)
        
        # Deterministic 80/20 split with exact seed=42 from academic notebook
        train_df, _ = df_ml.randomSplit([0.8, 0.2], seed=42)
        
        scaler = StandardScaler(
            inputCol="features",
            outputCol="scaledFeatures",
            withStd=True,
            withMean=True
        )
        self._scaler_model = scaler.fit(train_df)
        
        # Extract and cache mean and std vectors
        self._mean_vector = [float(x) for x in self._scaler_model.mean.toArray()]
        self._std_vector = [float(x) for x in self._scaler_model.std.toArray()]
        
        # Persist statistics in product ml_artifacts for documentation and fast reference
        try:
            stats = {
                "training_instances": train_df.count(),
                "split_seed": 42,
                "split_ratio": [0.8, 0.2],
                "feature_names": settings.FEATURE_NAMES,
                "means": self._mean_vector,
                "stddevs": self._std_vector
            }
            with open(self.stats_file, "w", encoding="utf-8") as f:
                json.dump(stats, f, indent=2)
            logger.info("Training scaling statistics saved to %s", self.stats_file)
        except Exception as e:
            logger.warning("Could not persist training_statistics.json: %s", e)

        logger.info("StandardScaler bridge initialized successfully. Means: %s", self._mean_vector[:3])

    def transform(self, df_with_features: DataFrame) -> DataFrame:
        """
        Transforms a DataFrame containing a 'features' vector column into one with 'scaledFeatures'.
        """
        if self._scaler_model is None:
            raise RuntimeError("ScalerService is not initialized. Call initialize(spark) first.")
        return self._scaler_model.transform(df_with_features)

    def scale_vector(self, raw_vector: Vector) -> Vector:
        """
        Mathematically scales a single vector using the exact training means and stddevs.
        Useful for direct inspection and validation.
        """
        if self._mean_vector is None or self._std_vector is None:
            raise RuntimeError("ScalerService statistics not initialized.")
        raw_arr = raw_vector.toArray()
        scaled_arr = [
            (val - mu) / sigma if sigma != 0.0 else 0.0
            for val, mu, sigma in zip(raw_arr, self._mean_vector, self._std_vector)
        ]
        return Vectors.dense(scaled_arr)

    @property
    def is_ready(self) -> bool:
        return self._scaler_model is not None

scaler_service = ScalerService()
