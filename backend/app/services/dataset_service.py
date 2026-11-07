import json
from pathlib import Path
from typing import Dict, Any, List
from app.core.config import settings

class DatasetService:
    def __init__(self):
        self.manifest_path: Path = settings.PRODUCT_DATA_DIR / "dataset_manifest.json"
        self.samples_path: Path = settings.PRODUCT_DATA_DIR / "sample_events.json"
        self.distributions_path: Path = settings.PRODUCT_DATA_DIR / "feature_distributions.json"
        self._manifest_cache: Dict[str, Any] = {}
        self._samples_cache: List[Dict[str, Any]] = []
        self._distributions_cache: Dict[str, Any] = {}
        self._load_data()

    def _load_data(self) -> None:
        if self.manifest_path.exists():
            with open(self.manifest_path, "r", encoding="utf-8") as f:
                self._manifest_cache = json.load(f)
        if self.samples_path.exists():
            with open(self.samples_path, "r", encoding="utf-8") as f:
                self._samples_cache = json.load(f)
        if self.distributions_path.exists():
            with open(self.distributions_path, "r", encoding="utf-8") as f:
                self._distributions_cache = json.load(f)

    def _ensure_loaded(self) -> None:
        if not self._manifest_cache or not self._samples_cache or not self._distributions_cache:
            self._load_data()

    def get_info(self) -> Dict[str, Any]:
        self._ensure_loaded()
        return {
            "dataset_name": self._manifest_cache.get("dataset_name", "MAGIC gamma telescope data 2004"),
            "source": self._manifest_cache.get("source", "UCI Machine Learning Repository"),
            "origin": self._manifest_cache.get("origin", "Major Atmospheric Gamma Imaging Cherenkov Telescope Project"),
            "total_records": self._manifest_cache.get("total_records", 19020),
            "number_of_features": len(self._manifest_cache.get("features", [])),
            "feature_names": [f["name"] for f in self._manifest_cache.get("features", [])],
            "missing_values": self._manifest_cache.get("missing_values", 0),
            "target_classes": self._manifest_cache.get("classes", {})
        }

    def get_statistics(self) -> Dict[str, Any]:
        self._ensure_loaded()
        return {
            "total_records": self._manifest_cache.get("total_records", 19020),
            "features": self._manifest_cache.get("features", []),
            "class_distribution": self._manifest_cache.get("classes", {})
        }

    def get_samples(self) -> List[Dict[str, Any]]:
        self._ensure_loaded()
        return self._samples_cache

    def get_all_feature_distributions(self) -> Dict[str, Any]:
        self._ensure_loaded()
        return self._distributions_cache

    def get_feature_distribution(self, feature_name: str) -> Dict[str, Any]:
        self._ensure_loaded()
        return self._distributions_cache.get(feature_name)

dataset_service = DatasetService()

