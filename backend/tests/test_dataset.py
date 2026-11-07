import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_dataset_info():
    with TestClient(app) as client:
        response = client.get("/api/v1/dataset/info")
        assert response.status_code == 200
        data = response.json()
        assert data["total_records"] == 19020
        assert data["number_of_features"] == 10
        assert data["missing_values"] == 0
        assert "g" in data["target_classes"]
        assert "h" in data["target_classes"]
        assert data["target_classes"]["g"]["count"] == 12332
        assert data["target_classes"]["h"]["count"] == 6688

def test_dataset_statistics():
    with TestClient(app) as client:
        response = client.get("/api/v1/dataset/statistics")
        assert response.status_code == 200
        data = response.json()
        assert data["total_records"] == 19020
        assert len(data["features"]) == 10
        
        # Check fAlpha feature bounds and definition
        alpha_stat = next(f for f in data["features"] if f["name"] == "fAlpha")
        assert alpha_stat["min"] == 0.0
        assert alpha_stat["max"] == 90.0
        assert alpha_stat["unit"] == "degrees"

def test_dataset_samples():
    with TestClient(app) as client:
        response = client.get("/api/v1/dataset/samples")
        assert response.status_code == 200
        samples = response.json()
        assert len(samples) >= 2
        
        for sample in samples:
            assert "id" in sample
            assert "actual_class" in sample
            assert sample["actual_class"] in ["g", "h"]
            assert len(sample["features"]) == 10
