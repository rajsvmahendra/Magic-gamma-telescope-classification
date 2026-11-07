# Models & Preprocessing Specification

## 1. Overview of Academic ML Models

The academic machine learning project trained and exported two Spark ML classification models located in `C:\INT315_Project_68\models`:

| Property | Logistic Regression (`logistic_regression_scaled`) | Random Forest (`random_forest`) |
| :--- | :--- | :--- |
| **Spark ML Class** | `pyspark.ml.classification.LogisticRegressionModel` | `pyspark.ml.classification.RandomForestClassificationModel` |
| **Input Feature Col** | `scaledFeatures` (Standardized vector) | `features` (Raw assembled vector) |
| **Label Col** | `label` (0.0 = Gamma, 1.0 = Hadron) | `label` (0.0 = Gamma, 1.0 = Hadron) |
| **Key Hyperparameters** | `maxIter=100`, `regParam=0.0`, `elasticNet=0.0` | `numTrees=100`, `maxDepth=5`, `impurity="gini"` |
| **Accuracy** | **78.75%** | **84.07%** |
| **Weighted Precision** | **0.7852** | **0.8454** |
| **Weighted Recall** | **0.7875** | **0.8407** |
| **Weighted F1-Score**| **0.7789** | **0.8338** |
| **ROC-AUC** | **0.8388** | **0.8869** |

---

## 2. The Critical Preprocessing Requirement (StandardScaler Bridge)

### The Issue
In cell 41 of `magic_gamma_classification.ipynb`, the training pipeline configured:
```python
scaler = StandardScaler(
    inputCol="features",
    outputCol="scaledFeatures",
    withStd=True,
    withMean=True
)
scaler_model = scaler.fit(train_df)
train_scaled = scaler_model.transform(train_df)
```
And Logistic Regression was fitted to `train_scaled`:
```python
lr_scaled = LogisticRegression(featuresCol="scaledFeatures", labelCol="label")
lr_scaled_model = lr_scaled.fit(train_scaled)
```
However, in cell 48, only `lr_scaled_model` and `rf_model` were persisted to disk:
```python
lr_scaled_model.write().overwrite().save("../models/logistic_regression_scaled")
rf_model.write().overwrite().save("../models/random_forest")
```
The fitted `scaler_model` was **not saved** as a persistent artifact.

### The Impact
If `RandomForestClassificationModel.load()` is called, it requires a DataFrame with a `features` vector column. This works directly on raw input values, as demonstrated in `src/predict.py`.

However, if `LogisticRegressionModel.load()` is called and passed a DataFrame containing only a `features` column, PySpark will fail with:
```
IllegalArgumentException: Field "scaledFeatures" does not exist.
```

### The Solution: Non-Destructive Reproducibility
The academic project **must not be modified or re-run**. The backend resolves this by either:
1. **Deterministic Scaler Computation:**
   Because `train_df` was generated using a fixed split seed:
   ```python
   train_df, test_df = df_ml.randomSplit([0.8, 0.2], seed=42)
   ```
   The backend can fit a `StandardScaler` during its startup initialization using the exact same deterministic split on `magic04.data`, producing the identical scale parameters.
2. **Pre-computed Mean/Std Vector Bridge:**
   The exact mean ($\mu$) and standard deviation ($\sigma$) vectors computed over the 15,278 training rows are applied mathematically to scale incoming feature vectors before packaging them into `scaledFeatures`:
   $$z_i = \frac{x_i - \mu_i}{\sigma_i}$$
This guarantees mathematical parity with training time while preserving 100% isolation of the parent academic files.

---

## 3. Verified Benchmark Confusion Matrices

### Logistic Regression (Test set: $N = 3,742$)
```
                     Predicted: Gamma (0)    Predicted: Hadron (1)
Actual: Gamma (0)           2,189                    228
Actual: Hadron (1)            567                    758
```
- False Alarms (Hadrons mistaken for Gammas): 567
- Missed Detections (Gammas mistaken for Hadrons): 228

### Random Forest (Test set: $N = 3,742$)
```
                     Predicted: Gamma (0)    Predicted: Hadron (1)
Actual: Gamma (0)           2,298                    119
Actual: Hadron (1)            477                    848
```
- False Alarms (Hadrons mistaken for Gammas): 477 (-15.9% vs LR)
- Missed Detections (Gammas mistaken for Hadrons): 119 (-47.8% vs LR)

These verified counts will be directly surfaced in the frontend's interactive confusion matrix viewer.
