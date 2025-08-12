import sys
import json
import joblib
import pandas as pd
import numpy as np
import os
import warnings

warnings.filterwarnings("ignore")

base_dir = os.path.dirname(__file__)

# Load model and encoders
model = joblib.load(os.path.join(base_dir, "xgb_model.pkl"))
symptom_encoder = joblib.load(os.path.join(base_dir, "symptom_encoder.pkl"))
label_encoder = joblib.load(os.path.join(base_dir, "label_encoder.pkl"))
bodypart_encoder = joblib.load(os.path.join(base_dir, "bodypart_encoder.pkl"))
feature_columns = joblib.load(os.path.join(base_dir, "feature_columns.pkl"))

# 🎯 Dynamically get disease names
classes = label_encoder.classes_

# Get input from Node.js
input_str = sys.argv[1]
input_data = json.loads(input_str)

def preprocess_input(data):
    known_symptoms = symptom_encoder
    symptom_flags = dict.fromkeys(known_symptoms, 0)

    entered_symptoms = [s.strip().lower().replace(" ", "_") for s in data['primarySymptoms'].split(",")]
    for symptom in entered_symptoms:
        col = f'has_{symptom}'
        if col in symptom_flags:
            symptom_flags[col] = 1

    severity_map = {'low': 0, 'medium': 1, 'high': 2}
    severity = severity_map.get(data['severityLevel'].lower(), 1)

    # 🛠 Body Part Handling (with stomach -> abdomen fix)
    body_part = data['affectedBodyParts'].strip()
    if body_part.lower() == "stomach":
        body_part = "Abdomen"  # Auto-correct

    try:
        body_encoded = bodypart_encoder.transform([body_part])[0]
    except:
        print(f"Warning: '{body_part}' not seen during training. Defaulting to 0.", file=sys.stderr)
        body_encoded = 0

    base_input = {
        'Severity_Level': severity,
        'Affected_Body_Parts': body_encoded,
        'Sleep_Hours': float(data['sleepHours']),
        'Recent_Travel_History': 1 if data['travelHistory'].lower() == "yes" else 0,
        'Exposure_to_Sick_People': 1 if data['exposure'].lower() == "yes" else 0,
    }

    symptom_count = sum(symptom_flags.values())
    high_risk_flag = 1 if severity == 2 and symptom_count > 2 else 0

    respiratory_keywords = ['cough', 'fever', 'chest_pain', 'wheezing', 'shortness_of_breath']
    gastro_keywords = ['nausea', 'vomiting', 'diarrhea', 'stomach_ache', 'dehydration']
    neuro_keywords = ['headache', 'dizziness', 'confusion', 'light_sensitivity']

    respiratory_issue = any(f'has_{symptom}' in symptom_flags and symptom_flags[f'has_{symptom}'] for symptom in respiratory_keywords)
    gastro_issue = any(f'has_{symptom}' in symptom_flags and symptom_flags[f'has_{symptom}'] for symptom in gastro_keywords)
    neuro_issue = any(f'has_{symptom}' in symptom_flags and symptom_flags[f'has_{symptom}'] for symptom in neuro_keywords)

    input_row = {
        **base_input,
        **symptom_flags,
        'symptom_count': symptom_count,
        'High_Risk_Flag': high_risk_flag,
        'respiratory_issue': int(respiratory_issue),
        'gastro_issue': int(gastro_issue),
        'neuro_issue': int(neuro_issue),
        'symptom_severity_score': symptom_count * severity,
        'symptom_category_count': sum([respiratory_issue, gastro_issue, neuro_issue])
    }

    df = pd.DataFrame([input_row])
    df = df.reindex(columns=feature_columns, fill_value=0)
    return df

try:
    X = preprocess_input(input_data)
    probs = model.predict_proba(X)[0]
    top_indices = np.argsort(probs)[-3:][::-1]

    top_predictions = []
    for idx in top_indices:
        disease_name = classes[idx] if idx < len(classes) else "Unknown Disease"
        probability = probs[idx] * 100
        top_predictions.append({
            "disease": disease_name,
            "probability": float(round(probability, 2))
        })

    top_disease = top_predictions[0]["disease"].lower()
    if top_disease in ["common cold", "flu", "mild flu"]:
        recommendation = "Rest and stay hydrated"
    else:
        recommendation = "Consult a doctor"

    result = {
        "topPredictions": top_predictions,
        "recommendation": recommendation
    }

    print(json.dumps(result))  # 🚨 Must be last line!

except Exception as e:
    print(json.dumps({"error": "Prediction failed", "details": str(e)}))
    sys.exit(1)