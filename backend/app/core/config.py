from pathlib import Path
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "MAGIC Gamma Explorer API"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Path Resolution
    # config.py -> core (parents[0]) -> app (parents[1]) -> backend (parents[2]) -> MAGIC_GAMMA_EXPLORER (parents[3]) -> INT315_Project_68 (parents[4])
    BACKEND_DIR: Path = Path(__file__).resolve().parents[2]
    EXPLORER_ROOT: Path = Path(__file__).resolve().parents[3]
    ACADEMIC_ROOT: Path = Path(__file__).resolve().parents[4]
    
    # Read-Only Academic Sources
    DATA_DIR: Path = ACADEMIC_ROOT / "Data"
    MODELS_DIR: Path = ACADEMIC_ROOT / "models"
    
    RAW_DATA_PATH: Path = DATA_DIR / "magic04.data"
    NAMES_FILE_PATH: Path = DATA_DIR / "magic04.names"
    
    RANDOM_FOREST_MODEL_PATH: Path = MODELS_DIR / "random_forest"
    LOGISTIC_REGRESSION_MODEL_PATH: Path = MODELS_DIR / "logistic_regression_scaled"
    
    # Product Artifacts
    PRODUCT_DATA_DIR: Path = EXPLORER_ROOT / "data"
    PRODUCT_ML_ARTIFACTS_DIR: Path = EXPLORER_ROOT / "ml_artifacts"
    
    # Feature Names (Ordered exactly as VectorAssembler requires)
    FEATURE_NAMES: list[str] = [
        "fLength",
        "fWidth",
        "fSize",
        "fConc",
        "fConc1",
        "fAsym",
        "fM3Long",
        "fM3Trans",
        "fAlpha",
        "fDist"
    ]
    
    # Label Names
    LABEL_NAMES: dict[int, str] = {
        0: "Gamma (signal)",
        1: "Hadron (background)"
    }
    
    # Allowed CORS Origins for local frontend development
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]

settings = Settings()

