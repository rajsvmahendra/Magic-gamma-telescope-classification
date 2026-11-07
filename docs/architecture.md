# System Architecture & Boundary Specification

## 1. Architectural Overview

**MAGIC GAMMA EXPLORER** is engineered as a decoupled, multi-tier system that provides an interactive observatory experience on top of verified academic machine learning artifacts.

```
+-------------------------------------------------------------------------------+
|                       ACADEMIC PROJECT (INT315 Project 68)                    |
|                         [IMMUTABLE SOURCE OF TRUTH]                           |
|                                                                               |
|  • Raw Data: Data/magic04.data, Data/magic04.names                            |
|  • Spark ML Models: models/random_forest, models/logistic_regression_scaled   |
|  • Benchmark Metrics: notebooks/magic_gamma_classification.ipynb              |
|  • Visual Assets: outputs/model_performance_comparison.png, etc.              |
+---------------------------------------+---------------------------------------+
                                        |
                            (Read-Only Data Access)
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                       MAGIC GAMMA EXPLORER: BACKEND LAYER                     |
|                                (Python / FastAPI)                             |
|                                                                               |
|  • Spark Model Service: Loads & invokes native Spark ML Parquet models        |
|  • Preprocessing Bridge: Reproduces exact training StandardScaler for LR      |
|  • Metadata & Stats Service: Serves verified Hillas parameter distributions   |
|  • Validation: Strict Pydantic v2 schemas for all 10 features                 |
|  • API Exposure: Asynchronous REST endpoints via OpenAPI / Swagger            |
+---------------------------------------+---------------------------------------+
                                        |
                                (REST JSON APIs)
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                      MAGIC GAMMA EXPLORER: FRONTEND LAYER                     |
|                         (React / Vite / Three.js / GSAP)                      |
|                                                                               |
|  • Observatory UI: Atmospheric, astrophysical dark theme                      |
|  • 3D Simulation: Hexagonal PMT camera plane & Hillas ellipse reconstruction  |
|  • Data Analytics: Interactive confusion matrices, ROC curves, metric charts |
|  • Live Predictor: Real-time slider controls communicating with backend API   |
+-------------------------------------------------------------------------------+
```

---

## 2. Explicit Boundary Definition

| Boundary Element | Academic Project (`C:\INT315_Project_68`) | MAGIC GAMMA EXPLORER (`MAGIC_GAMMA_EXPLORER/`) |
| :--- | :--- | :--- |
| **Role** | Ground Truth & Training Authority | Presentation, Simulation & Interactive API |
| **State** | **Read-Only** (Freeze state) | Active Development |
| **Dependencies** | Python 3.11, PySpark 3.5.9, NumPy 2.4 | FastAPI, Uvicorn, Pydantic, React, Three.js, GSAP |
| **ML Engine** | Apache Spark ML (Local SparkSession) | Spark ML via Backend Service |
| **Model Storage** | `models/` Parquet files & metadata | Manifest references pointing to `../models/` |
| **Dataset Storage**| `Data/magic04.data` (19,020 rows) | Manifest references pointing to `../Data/` |
| **Direct UI Access**| None (Notebook & CLI only) | Modern Web Browser |

---

## 3. Data Flow & Inference Lifecycle

1. **User Interaction:**
   The user manipulates one or more of the 10 Hillas feature sliders in the React frontend (or selects a pre-configured cosmic event preset).
2. **Payload Dispatch:**
   The frontend dispatches a `POST` request with JSON payload to `/api/v1/predict/random-forest` or `/api/v1/predict/logistic-regression`.
3. **Pydantic Validation:**
   FastAPI validates the numerical values against empirical dataset boundaries ($fLength > 0$, $0^\circ \le fAlpha \le 90^\circ$, etc.).
4. **Vector Assembly & Preprocessing:**
   - **For Random Forest:** Values are converted into a Spark `DenseVector` directly.
   - **For Logistic Regression:** Values pass through the `StandardScaler` bridge using exact training-set mean and variance vectors to generate `scaledFeatures`.
5. **Model Evaluation:**
   The singleton Spark model evaluates the vector through `.transform()` and extracts raw prediction and class probability distribution.
6. **Response Serialization:**
   FastAPI packages the outcome into a structured JSON response:
   ```json
   {
     "model": "random_forest",
     "prediction": 0,
     "class_name": "Gamma (signal)",
     "probabilities": {
       "gamma": 0.942,
       "hadron": 0.058
     },
     "confidence": 0.942,
     "is_signal": true
   }
   ```
7. **Frontend Visualization:**
   The frontend renders the classification badge, updates probability gauges, and re-renders the 3D Cherenkov shower ellipse accordingly.
