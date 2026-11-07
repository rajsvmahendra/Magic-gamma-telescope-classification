const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const API_PREFIX = `${API_BASE_URL}/api/v1`;

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_PREFIX}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      let errorDetail = null;
      try {
        const errorJson = await res.json();
        errorDetail = errorJson.detail || errorJson.message;
      } catch {
        errorDetail = res.statusText;
      }
      throw new ApiError(
        errorDetail || `API request failed with status ${res.status}`,
        res.status,
        errorDetail
      );
    }

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      'Observatory connection unavailable. Please ensure the PySpark FastAPI service is running on port 8000.',
      0,
      err.message
    );
  }
}

export const api = {
  getHealth: () => request('/health'),
  getDatasetInfo: () => request('/dataset/info'),
  getDatasetStatistics: () => request('/dataset/statistics'),
  getDatasetSamples: () => request('/dataset/samples'),
  getModels: () => request('/models'),
  getModelMetrics: () => request('/models/metrics'),
  getConfusionMatrix: (modelName) => request(`/models/${modelName}/confusion-matrix`),
  getFeatureImportance: () => request('/models/random_forest/feature-importance'),
  getFeatureDistributions: () => request('/dataset/features/distributions'),
  getFeatureDistribution: (featureName) => request(`/dataset/features/${featureName}/distribution`),
  predictRandomForest: (features) => request('/predict/random-forest', {
    method: 'POST',
    body: JSON.stringify(features)
  }),
  predictLogisticRegression: (features) => request('/predict/logistic-regression', {
    method: 'POST',
    body: JSON.stringify(features)
  })
};

