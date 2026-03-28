from prophet import Prophet
import pandas as pd
import joblib
import os

MODEL_DIR = "saved_models"
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def forecast_branch(df, branch_id, metric):
    """
    df: columns ds, y
    branch_id & metric: used to create a unique filename for caching
    """
    model_path = os.path.join(MODEL_DIR, f"model_{branch_id}_{metric}.joblib")

    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
    else:
        
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.2
        )
        model.fit(df)
        
        joblib.dump(model, model_path)

   
    future = model.make_future_dataframe(periods=24, freq="MS")
    forecast = model.predict(future)

    forecast['ds'] = pd.to_datetime(forecast['ds'])
    forecast_2026 = forecast[forecast['ds'].dt.year == 2026]

    return forecast_2026

import numpy as np

def calculate_mape(actual_values, predicted_values):
    """
    Calculate Mean Absolute Percentage Error (MAPE)
    and Forecast Accuracy.

    Parameters:
        actual_values (list or array): Real historical values
        predicted_values (list or array): Forecasted values

    Returns:
        dict: mape (%) and accuracy (%)
    """

    actual = np.array(actual_values, dtype=float)
    predicted = np.array(predicted_values, dtype=float)

    # Avoid division by zero
    mask = actual != 0
    actual = actual[mask]
    predicted = predicted[mask]

    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    accuracy = 100 - mape

    return {
        "mape": round(mape, 2),
        "accuracy": round(accuracy, 2)
    }
