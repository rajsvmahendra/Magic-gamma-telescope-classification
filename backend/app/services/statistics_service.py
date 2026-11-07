import json
from pathlib import Path
from typing import Dict, Any, List
from app.core.config import settings

class StatisticsService:
    def __init__(self):
        self.manifest_path: Path = settings.PRODUCT_ML_ARTIFACTS_DIR / "model_manifest.json"
        self._manifest_cache: Dict[str, Any] = {}
        self._load_data()

    def _load_data(self) -> None:
        if self.manifest_path.exists():
            with open(self.manifest_path, "r", encoding="utf-8") as f:
                self._manifest_cache = json.load(f)

    def _ensure_loaded(self) -> None:
        if not self._manifest_cache:
            self._load_data()

    def get_models_list(self) -> Dict[str, Any]:
        self._ensure_loaded()
        models_data = self._manifest_cache.get("models", {})
        model_details = []
        for key, val in models_data.items():
            model_details.append({
                "model_name": key,
                "algorithm": val.get("model_type", ""),
                "required_feature_column": val.get("required_features_column", "features"),
                "requires_scaling": val.get("requires_scaling", False),
                "hyperparameters": val.get("hyperparameters", {}),
                "evaluation_metrics": val.get("evaluation_metrics", {})
            })
        return {
            "engine": self._manifest_cache.get("engine", "Apache PySpark ML"),
            "pyspark_version": self._manifest_cache.get("pyspark_version", "3.5.9"),
            "models": model_details
        }

    def get_metrics(self) -> Dict[str, Any]:
        self._ensure_loaded()
        models_data = self._manifest_cache.get("models", {})
        return {
            "logistic_regression": models_data.get("logistic_regression", {}).get("evaluation_metrics", {}),
            "random_forest": models_data.get("random_forest", {}).get("evaluation_metrics", {}),
            "source": "INT315 Project 68 academic evaluation on 3,742 test instances (seed=42)"
        }

    def get_confusion_matrix(self, model_name: str) -> Dict[str, Any]:
        self._ensure_loaded()
        normalized_name = model_name.lower().replace("-", "_")
        models_data = self._manifest_cache.get("models", {})
        if normalized_name not in models_data:
            raise KeyError(f"Unknown model: '{model_name}'. Available: {list(models_data.keys())}")

        model_info = models_data[normalized_name]
        raw_cm = model_info.get("confusion_matrix", {})

        tp_gamma = raw_cm.get("true_gamma_pred_gamma", 0)
        fp_gamma = raw_cm.get("true_hadron_pred_gamma", 0)
        fn_gamma = raw_cm.get("true_gamma_pred_hadron", 0)
        tp_hadron = raw_cm.get("true_hadron_pred_hadron", 0)
        total_test = tp_gamma + fp_gamma + fn_gamma + tp_hadron

        breakdown = [
            {
                "actual": "Gamma (signal)",
                "predicted": "Gamma (signal)",
                "count": tp_gamma,
                "description": "True Positive (Signal correctly identified)"
            },
            {
                "actual": "Gamma (signal)",
                "predicted": "Hadron (background)",
                "count": fn_gamma,
                "description": "False Negative (Signal misclassified as background)"
            },
            {
                "actual": "Hadron (background)",
                "predicted": "Gamma (signal)",
                "count": fp_gamma,
                "description": "False Alarm (Background misclassified as signal - critical telescope noise)"
            },
            {
                "actual": "Hadron (background)",
                "predicted": "Hadron (background)",
                "count": tp_hadron,
                "description": "True Negative (Background cosmic ray correctly rejected)"
            }
        ]

        return {
            "model_name": normalized_name,
            "test_set_size": total_test,
            "matrix": raw_cm,
            "breakdown": breakdown,
            "labels": {
                "0": "Gamma (signal)",
                "1": "Hadron (background)"
            }
        }

statistics_service = StatisticsService()
