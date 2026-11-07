import os
from pathlib import Path
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "MAGIC Gamma Explorer API"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    BACKEND_DIR: Path = Path(__file__).resolve().parents[2]
    EXPLORER_ROOT: Path = Path("/app")

    # Deployment assets
    DATA_DIR: Path = EXPLORER_ROOT / "data"
    MODELS_DIR: Path = EXPLORER_ROOT / "ml_artifacts"

    RAW_DATA_PATH: Path = DATA_DIR / "magic04.data"
    NAMES_FILE_PATH: Path = DATA_DIR / "magic04.names"

    RANDOM_FOREST_MODEL_PATH: Path = MODELS_DIR / "random_forest"
    LOGISTIC_REGRESSION_MODEL_PATH: Path = MODELS_DIR / "logistic_regression_scaled"

    PRODUCT_DATA_DIR: Path = EXPLORER_ROOT / "data"
    PRODUCT_ML_ARTIFACTS_DIR: Path = EXPLORER_ROOT / "ml_artifacts"

    FEATURE_NAMES: list[str] = [
        "fLength", "fWidth", "fSize", "fConc", "fConc1",
        "fAsym", "fM3Long", "fM3Trans", "fAlpha", "fDist"
    ]

    LABEL_NAMES: dict[int, str] = {
        0: "Gamma (signal)",
        1: "Hadron (background)"
    }

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "https://magic-gamma-telescope-classification-ckvea37o9.vercel.app",
    ]

settings = Settings()
