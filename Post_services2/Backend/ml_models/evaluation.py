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
