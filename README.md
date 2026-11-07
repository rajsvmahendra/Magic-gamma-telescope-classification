# MAGIC GAMMA EXPLORER

An interactive scientific exploration and machine learning observatory web platform built around the **UCI MAGIC Gamma Telescope Dataset** and the **INT315 Project 68** academic PySpark classification models.

---

## 1. Product Vision

**MAGIC GAMMA EXPLORER** transforms an academic machine-learning codebase into a premium, interactive digital observatory experience.

The core narrative follows the complete scientific discovery chain:
$$\text{Cherenkov Telescope} \longrightarrow \text{Cosmic Cascade} \longrightarrow \text{Camera Image} \longrightarrow \text{Hillas Parameters} \longrightarrow \text{PySpark ML} \longrightarrow \text{Classification \& Discovery}$$

The platform is designed to evoke the ambiance of entering an astrophysical laboratory where researchers and visitors investigate high-energy cosmic rays through data storytelling, 3D shower reconstructions, and real-time model inference.

---

## 2. Relationship to Academic Project (INT315 Project 68)

The parent workspace `C:\INT315_Project_68` contains the original academic machine learning project:
- **Academic Project (INT315 Project 68):** The immutable **Source of Truth** for data, preprocessing methodology, Spark ML training, performance metrics, and model artifacts.
- **MAGIC GAMMA EXPLORER (`MAGIC_GAMMA_EXPLORER/`):** A standalone personal product providing the presentation, visualization, API, and interactive user experience layer.

---

## 3. Strict Non-Negotiable Isolation Principle

To protect the integrity of the academic project:
1. **Zero Mutations Outside `MAGIC_GAMMA_EXPLORER/`:** The parent files (`Data/`, `models/`, `notebooks/`, `outputs/`, `src/`, `requirements.txt`, `.venv/`) are strictly **read-only**.
2. **Dedicated Environments:** The product maintains its own backend environment and frontend package dependencies.
3. **No Model Overwriting:** Existing PySpark model artifacts in `models/` are never overwritten, retrained, or renamed.
4. **Authoritative ML Engine:** Spark ML remains the sole authoritative model engine. No scikit-learn approximations or hardcoded mock predictions are permitted.

---

## 4. System Architecture

```
Academic Project (INT315 Project 68) [READ-ONLY SOURCE OF TRUTH]
   ├── Data/magic04.data & magic04.names
   └── models/random_forest & logistic_regression_scaled
            │
            ▼ (Read-only integration)
MAGIC GAMMA EXPLORER
   ├── Backend (FastAPI + Python 3.11 + PySpark 3.5.9)
   │     ├── REST API Endpoints
   │     ├── Spark ML Model Service
   │     ├── Preprocessing Reproduction (StandardScaler bridge)
   │     └── Dataset & Metrics Services
   │
   └── Frontend (React + Vite + Three.js + React Three Fiber + GSAP)
         ├── 3D Cherenkov PMT Camera & Shower Ellipse Visualizer
         ├── Hillas Feature Explorer & Interactive Sliders
         ├── Model Comparison & Confusion Matrix Analyzer
         └── Live Cosmic Event Predictor
```

---

## 5. Technology Stack

### Backend
- **Framework:** FastAPI with Uvicorn
- **ML Runtime:** Apache PySpark 3.5.9 (Python 3.11)
- **Data Validation:** Pydantic v2
- **Data Structures:** NumPy 2.x

### Frontend
- **Core:** React 18 / 19 + Vite
- **3D & WebGL Graphics:** Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animations:** GSAP (GreenSock) for cinematic transitions and scroll narratives
- **Styling:** Curated modern CSS design system (astrophysical dark mode palette)
- **Icons & UI:** Lucide React

---

## 6. Preprocessing & Model Requirements

- **Random Forest:** The saved model `models/random_forest` was trained on unscaled vector features (`features`). It accepts raw 10-dimensional Hillas parameter inputs directly.
- **Logistic Regression:** The saved model `models/logistic_regression_scaled` requires `scaledFeatures`. The backend reproduces the exact training-time `StandardScaler` transformation using verified baseline statistics without modifying the academic artifacts.

---

## 7. Product Development Roadmap

- **Phase 1: Foundation & Architecture Setup (CURRENT)**
  - Establish product directory structure
  - Document strict isolation boundaries and architecture
  - Define backend schemas, manifests, and frontend skeletons
- **Phase 2: Backend API & PySpark Inference Service**
  - Implement FastAPI endpoints for dataset stats, metrics, and event samples
  - Implement robust PySpark model loading and inference pipelines
  - Validate reproducible predictions against `predict.py`
- **Phase 3: Core Frontend & Scientific Visualizations**
  - Build Vite + React UI shell with dark-space observatory aesthetics
  - Build interactive confusion matrix, metric radar, and parameter distribution views
- **Phase 4: 3D Cherenkov Telescope & Shower Simulator**
  - Develop Three.js / React Three Fiber interactive hexagonal PMT camera plane
  - Real-time Hillas shower ellipse generation based on input features
- **Phase 5: Polish, Performance Optimization & Verification**
  - Fine-tune animations, responsive layout, end-to-end integration testing
