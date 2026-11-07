import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "MAGIC Gamma Explorer" in data["service"]

def test_health():
    with TestClient(app) as test_client:
        response = test_client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["spark_connected"] is True
        assert data["models_loaded"]["random_forest"] is True
        assert data["models_loaded"]["logistic_regression"] is True
        assert data["models_loaded"]["scaler_ready"] is True
