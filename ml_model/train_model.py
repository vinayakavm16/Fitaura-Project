import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix
from sklearn.utils import shuffle
from scipy.spatial.distance import cosine

# 1. Load and shuffle the dataset
df = pd.read_csv("finaldata.csv")
df = shuffle(df, random_state=42)

# 2. Encode categorical features
encoders = {}

# Severity Level
severity_levels = ['low', 'medium', 'high']
for v in df["Severity_Level"].unique():
    if v not in severity_levels:
        severity_levels.append(v)
sev_enc = LabelEncoder().fit(severity_levels)
df["Severity_Level"] = sev_enc.transform(df["Severity_Level"])
encoders["Severity_Level"] = sev_enc

# Affected Body Parts
bp_enc = LabelEncoder().fit(df["Affected_Body_Parts"].unique())
df["Affected_Body_Parts"] = bp_enc.transform(df["Affected_Body_Parts"])
encoders["Affected_Body_Parts"] = bp_enc

# Binary map for yes/no
binary_map = {"Yes": 1, "No": 0}
df["Recent_Travel_History"] = df["Recent_Travel_History"].map(binary_map)
df["Exposure_to_Sick_People"] = df["Exposure_to_Sick_People"].map(binary_map)

# 3. Encode Disease
initial_le = LabelEncoder().fit(df["Disease"])
df["Disease"] = initial_le.transform(df["Disease"])
encoders["initial_Disease"] = initial_le

# 4. Save Symptom Columns
symptom_cols = [col for col in df.columns if col.startswith('has_')]
joblib.dump(symptom_cols, "symptom_encoder.pkl")

# 5. Feature Engineering
df["symptom_severity_score"] = df[symptom_cols].sum(axis=1)

# Rough category counts
respiratory_keywords = ['cough', 'fever', 'chest_pain', 'wheezing', 'shortness_of_breath']
gastro_keywords = ['nausea', 'vomiting', 'diarrhea', 'stomach_ache', 'dehydration']
neuro_keywords = ['headache', 'dizziness', 'confusion', 'light_sensitivity']

df["respiratory_issue"] = df[[f"has_{symptom}" for symptom in respiratory_keywords if f"has_{symptom}" in df.columns]].max(axis=1)
df["gastro_issue"] = df[[f"has_{symptom}" for symptom in gastro_keywords if f"has_{symptom}" in df.columns]].max(axis=1)
df["neuro_issue"] = df[[f"has_{symptom}" for symptom in neuro_keywords if f"has_{symptom}" in df.columns]].max(axis=1)

df["symptom_category_count"] = df[["respiratory_issue", "gastro_issue", "neuro_issue"]].sum(axis=1)

# 6. Remove rare diseases
y_initial = df["Disease"]
rare = y_initial.value_counts()[lambda x: x == 1].index
df = df[~df["Disease"].isin(rare)].reset_index(drop=True)

# 7. Final Disease Encoding
df["Disease"] = initial_le.inverse_transform(df["Disease"])
final_le = LabelEncoder().fit(df["Disease"])
df["Disease"] = final_le.transform(df["Disease"])
encoders["Disease"] = final_le

# 8. Prepare X and y
X = df.drop(columns=["Disease"])
y = df["Disease"]

# 9. Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
# 10. Train XGBoost
param_grid = {
    "n_estimators": [100],
    "max_depth": [3, 5],
    "learning_rate": [0.05, 0.1],
    "subsample": [0.8, 1.0],
    "colsample_bytree": [0.8, 1.0]
}

grid = GridSearchCV(
    XGBClassifier(eval_metric='mlogloss', use_label_encoder=False, random_state=42),
    param_grid, cv=3, scoring='f1_micro', verbose=1, n_jobs=-1
)
grid.fit(X_train, y_train)
model = grid.best_estimator_

# 11. Evaluation
y_pred = model.predict(X_test)
print(f"\nAccuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"F1 Score: {f1_score(y_test, y_pred, average='micro'):.4f}")
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# 12. Save everything
joblib.dump(model, "xgb_model.pkl")
joblib.dump(encoders["Disease"], "label_encoder.pkl")
joblib.dump(encoders["Affected_Body_Parts"], "bodypart_encoder.pkl")
joblib.dump(encoders["Severity_Level"], "severity_encoder.pkl")
joblib.dump(list(X.columns), "feature_columns.pkl")