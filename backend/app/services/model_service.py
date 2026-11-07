import logging
from typing import Dict, Any, List, Optional
import threading

from pyspark.sql import SparkSession
from pyspark.ml.linalg import Vectors
from pyspark.ml.classification import (
    RandomForestClassificationModel,
    LogisticRegressionModel
)

from app.core.config import settings
from app.core.spark_session import get_spark_session
from app.services.scaler_service import scaler_service

logger = logging.getLogger("magic_gamma_explorer.models")

class ModelService:
    def __init__(self):
        self._rf_model: Optional[RandomForestClassificationModel] = None
        self._lr_model: Optional[LogisticRegressionModel] = None
        self._lock = threading.Lock()
        self._is_initialized = False

    def initialize(self) -> None:
        """
        Loads the Spark models into memory and sets up the scaler service.
        """
        with self._lock:
            if self._is_initialized:
                return

            spark = get_spark_session()
            
            logger.info("Loading Random Forest model from %s", settings.RANDOM_FOREST_MODEL_PATH)
            self._rf_model = RandomForestClassificationModel.load(str(settings.RANDOM_FOREST_MODEL_PATH))
            logger.info("Random Forest model loaded successfully. (Trees: %d)", self._rf_model.getNumTrees)

            logger.info("Initializing StandardScaler bridge...")
            scaler_service.initialize(spark)

            logger.info("Loading Logistic Regression model from %s", settings.LOGISTIC_REGRESSION_MODEL_PATH)
            self._lr_model = LogisticRegressionModel.load(str(settings.LOGISTIC_REGRESSION_MODEL_PATH))
            logger.info("Logistic Regression model loaded successfully.")

            self._is_initialized = True

    def get_status(self) -> Dict[str, bool]:
        return {
            "random_forest": self._rf_model is not None,
            "logistic_regression": self._lr_model is not None,
            "scaler_ready": scaler_service.is_ready
        }

    def get_rf_feature_importances(self) -> List[Dict[str, Any]]:
        """
        Extracts genuine Gini feature importances from the loaded PySpark RandomForestClassificationModel.
        """
        if not self._is_initialized or self._rf_model is None:
            self.initialize()
        if self._rf_model is None:
            raise RuntimeError("Random Forest model is not initialized.")

        importances = self._rf_model.featureImportances.toArray().tolist()

        feature_metadata = {
            "fLength": {"display_name": "Major Axis Length", "unit": "mm", "description": "RMS spread of light along the longitudinal development axis."},
            "fWidth": {"display_name": "Minor Axis Width", "unit": "mm", "description": "RMS spread of light along the lateral shower axis."},
            "fSize": {"display_name": "Total Shower Light", "unit": "log10 photons", "description": "Logarithm of total number of Cherenkov photons detected."},
            "fConc": {"display_name": "Core Concentration", "unit": "ratio", "description": "Fraction of light concentrated in the two brightest PMT pixels."},
            "fConc1": {"display_name": "Peak Pixel Ratio", "unit": "ratio", "description": "Fraction of total shower light in the single brightest pixel."},
            "fAsym": {"display_name": "Longitudinal Skew", "unit": "mm", "description": "Distance from highest density center to center of gravity."},
            "fM3Long": {"display_name": "3rd Longitudinal Moment", "unit": "mm", "description": "Third root of the third moment along the major axis."},
            "fM3Trans": {"display_name": "3rd Transverse Moment", "unit": "mm", "description": "Third root of the third moment along the minor axis."},
            "fAlpha": {"display_name": "Orientation Angle", "unit": "deg", "description": "Angle between shower major axis and camera center vector."},
            "fDist": {"display_name": "Distance from Center", "unit": "mm", "description": "Distance between shower centroid and the camera center."}
        }

        items = []
        for i, name in enumerate(settings.FEATURE_NAMES):
            imp = float(importances[i])
            meta = feature_metadata.get(name, {})
            items.append({
                "feature": name,
                "display_name": meta.get("display_name", name),
                "unit": meta.get("unit", ""),
                "description": meta.get("description", ""),
                "importance": round(imp, 4),
                "importance_percent": round(imp * 100, 2)
            })

        # Rank descending by importance
        items.sort(key=lambda x: x["importance"], reverse=True)
        for rank, item in enumerate(items, 1):
            item["rank"] = rank

        return items


    def predict_random_forest(self, feature_values: List[float]) -> Dict[str, Any]:
        """
        Runs inference on the PySpark Random Forest model.
        Expects 10 raw Hillas parameter values.
        """
        if self._rf_model is None:
            raise RuntimeError("Random Forest model is not initialized.")
        if len(feature_values) != 10:
            raise ValueError(f"Expected 10 features, got {len(feature_values)}")

        spark = get_spark_session()
        vector = Vectors.dense(feature_values)
        
        with self._lock:
            df = spark.createDataFrame([(vector,)], ["features"])
            row = self._rf_model.transform(df).select("prediction", "probability").collect()[0]

        pred_idx = int(row["prediction"])
        prob_vec = row["probability"]
        p_gamma = float(prob_vec[0])
        p_hadron = float(prob_vec[1])

        return {
            "model": "random_forest",
            "prediction": settings.LABEL_NAMES.get(pred_idx, "Unknown"),
            "prediction_index": pred_idx,
            "probability": {
                "gamma": round(p_gamma, 4),
                "hadron": round(p_hadron, 4)
            },
            "is_signal": bool(pred_idx == 0),
            "confidence": round(float(prob_vec[pred_idx]), 4),
            "raw_probabilities": [p_gamma, p_hadron]
        }

    def predict_logistic_regression(self, feature_values: List[float]) -> Dict[str, Any]:
        """
        Runs inference on the PySpark Logistic Regression model.
        Scales the 10 raw features using the exact StandardScaler bridge into 'scaledFeatures'.
        """
        if self._lr_model is None:
            raise RuntimeError("Logistic Regression model is not initialized.")
        if len(feature_values) != 10:
            raise ValueError(f"Expected 10 features, got {len(feature_values)}")

        spark = get_spark_session()
        vector = Vectors.dense(feature_values)
        
        with self._lock:
            df = spark.createDataFrame([(vector,)], ["features"])
            scaled_df = scaler_service.transform(df)
            row = self._lr_model.transform(scaled_df).select("prediction", "probability").collect()[0]

        pred_idx = int(row["prediction"])
        prob_vec = row["probability"]
        p_gamma = float(prob_vec[0])
        p_hadron = float(prob_vec[1])

        return {
            "model": "logistic_regression",
            "prediction": settings.LABEL_NAMES.get(pred_idx, "Unknown"),
            "prediction_index": pred_idx,
            "probability": {
                "gamma": round(p_gamma, 4),
                "hadron": round(p_hadron, 4)
            },
            "is_signal": bool(pred_idx == 0),
            "confidence": round(float(prob_vec[pred_idx]), 4),
            "raw_probabilities": [p_gamma, p_hadron]
        }

model_service = ModelService()
