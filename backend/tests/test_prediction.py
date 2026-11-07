import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_models_list():
    with TestClient(app) as client:
        response = client.get("/api/v1/models")
        assert response.status_code == 200
        data = response.json()
        assert len(data["models"]) == 2
        model_names = [m["model_name"] for m in data["models"]]
        assert "random_forest" in model_names
        assert "logistic_regression" in model_names

def test_model_metrics():
    with TestClient(app) as client:
        response = client.get("/api/v1/models/metrics")
        assert response.status_code == 200
        data = response.json()
        
        # Exact verified academic metrics
        lr_metrics = data["logistic_regression"]
        assert lr_metrics["accuracy"] == 0.7875
        assert lr_metrics["precision"] == 0.7852
        assert lr_metrics["recall"] == 0.7875
        assert lr_metrics["f1_score"] == 0.7789
        assert lr_metrics["roc_auc"] == 0.8388

        rf_metrics = data["random_forest"]
        assert rf_metrics["accuracy"] == 0.8407
        assert rf_metrics["precision"] == 0.8454
        assert rf_metrics["recall"] == 0.8407
        assert rf_metrics["f1_score"] == 0.8338
        assert rf_metrics["roc_auc"] == 0.8869

def test_confusion_matrices():
    with TestClient(app) as client:
        # Random Forest confusion matrix
        rf_resp = client.get("/api/v1/models/random_forest/confusion-matrix")
        assert rf_resp.status_code == 200
        rf_cm = rf_resp.json()["matrix"]
        assert rf_cm["true_gamma_pred_gamma"] == 2298
        assert rf_cm["true_gamma_pred_hadron"] == 119
        assert rf_cm["true_hadron_pred_gamma"] == 477
        assert rf_cm["true_hadron_pred_hadron"] == 848

        # Logistic Regression confusion matrix
        lr_resp = client.get("/api/v1/models/logistic_regression/confusion-matrix")
        assert lr_resp.status_code == 200
        lr_cm = lr_resp.json()["matrix"]
        assert lr_cm["true_gamma_pred_gamma"] == 2189
        assert lr_cm["true_gamma_pred_hadron"] == 228
        assert lr_cm["true_hadron_pred_gamma"] == 567
        assert lr_cm["true_hadron_pred_hadron"] == 758

def test_predict_random_forest_real_sample():
    """
    Tests live inference using the actual PySpark Random Forest model.
    Passes gamma_sample_01 (actual Gamma event with small fAlpha=6.36).
    """
    with TestClient(app) as client:
        payload = {
            "fLength": 31.6036,
            "fWidth": 11.7235,
            "fSize": 2.5185,
            "fConc": 0.5303,
            "fConc1": 0.3773,
            "fAsym": 26.2722,
            "fM3Long": 23.8238,
            "fM3Trans": -9.9574,
            "fAlpha": 6.3609,
            "fDist": 205.261
        }
        response = client.post("/api/v1/predict/random-forest", json=payload)
        assert response.status_code == 200
        result = response.json()
        assert result["model"] == "random_forest"
        assert result["prediction_index"] in [0, 1]
        assert "gamma" in result["probability"]
        assert "hadron" in result["probability"]
        assert 0.0 <= result["probability"]["gamma"] <= 1.0
        assert 0.0 <= result["probability"]["hadron"] <= 1.0
        # Probabilities should sum to approximately 1.0
        prob_sum = result["probability"]["gamma"] + result["probability"]["hadron"]
        assert abs(prob_sum - 1.0) < 0.01

def test_predict_logistic_regression_real_sample():
    """
    Tests live inference using the actual PySpark Logistic Regression model
    with the exact training-time StandardScaler bridge.
    Passes gamma_sample_01.
    """
    with TestClient(app) as client:
        payload = {
            "fLength": 31.6036,
            "fWidth": 11.7235,
            "fSize": 2.5185,
            "fConc": 0.5303,
            "fConc1": 0.3773,
            "fAsym": 26.2722,
            "fM3Long": 23.8238,
            "fM3Trans": -9.9574,
            "fAlpha": 6.3609,
            "fDist": 205.261
        }
        response = client.post("/api/v1/predict/logistic-regression", json=payload)
        assert response.status_code == 200
        result = response.json()
        assert result["model"] == "logistic_regression"
        assert result["prediction_index"] in [0, 1]
        assert "gamma" in result["probability"]
        assert "hadron" in result["probability"]
        assert 0.0 <= result["probability"]["gamma"] <= 1.0
        assert 0.0 <= result["probability"]["hadron"] <= 1.0
        prob_sum = result["probability"]["gamma"] + result["probability"]["hadron"]
        assert abs(prob_sum - 1.0) < 0.01

def test_invalid_input_handling():
    with TestClient(app) as client:
        # Missing fAlpha and negative fLength
        invalid_payload = {
            "fLength": -50.0,
            "fWidth": 11.7235
        }
        response = client.post("/api/v1/predict/random-forest", json=invalid_payload)
        assert response.status_code == 422
