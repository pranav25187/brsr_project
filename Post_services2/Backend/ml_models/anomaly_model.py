import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


DATA_PATH = r"C:\Users\prana\Desktop\brsr_project\Post_services2\synthetic_esg_data.csv"
MODEL_PATH = "backend/ml_models/isolation_forest_model.pkl"
SCALER_PATH = "backend/ml_models/scaler.pkl"

FEATURES = [
    "energy_kwh",
    "fuel_litres",
    "water_litres",
    "waste_kg",
    "paper_reams"
]


def load_data():
    df = pd.read_csv(DATA_PATH)
    return df[FEATURES]


def train_anomaly_model():
    print("🔹 Loading synthetic ESG data...")
    X = load_data()

    print("🔹 Scaling data...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("🔹 Training Isolation Forest model...")
    model = IsolationForest(
    n_estimators=200,
    contamination=0.2,   # ↑ more sensitive
    random_state=42
 )

    model.fit(X_scaled)

    print("🔹 Saving model and scaler...")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print("✅ Anomaly detection model trained and saved successfully!")


def predict_anomaly(input_data: dict):
    """
    input_data example:
    {
        "energy_kwh": 7000,
        "fuel_litres": 300,
        "water_litres": 12000,
        "waste_kg": 180,
        "paper_reams": 100
    }
    """

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    df = pd.DataFrame([input_data])
    X_scaled = scaler.transform(df)

    prediction = model.predict(X_scaled)[0]
    score = model.decision_function(X_scaled)[0]

    return {
        "is_anomaly": True if prediction == -1 else False,
        "anomaly_score": round(float(score), 4)
    }


if __name__ == "__main__":
    train_anomaly_model()
