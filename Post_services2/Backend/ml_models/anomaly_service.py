import numpy as np

# ===============================
# Hybrid Anomaly Detection
# ===============================


def check_anomaly(history, new_entry):
    """
    Tuned anomaly detection:
    - Spike > 30%  → anomaly
    - Drop  > 60%  → anomaly
    """

    # Not enough history → do not flag
    if not history or len(history) < 4:
        return False, 0.0

    metrics = [
        "energy_kwh",
        "fuel_litres",
        "water_litres",
        "waste_kg",
        "paper_reams"
    ]

    deviations = []

    for metric in metrics:
        values = [float(row[metric]) for row in history if row[metric] is not None]

        if not values:
            continue

        avg = np.mean(values)
        if avg == 0:
            continue

        current = float(new_entry[metric])
        deviation_pct = (current - avg) / avg   # signed deviation

        # 🚨 Spike rule (>30% increase)
        if deviation_pct > 0.30:
            return True, round(deviation_pct, 2)

        # 🚨 Drop rule (>60% decrease)
        if deviation_pct < -0.60:
            return True, round(abs(deviation_pct), 2)

        deviations.append(abs(deviation_pct))

    # No strong anomaly
    max_dev = max(deviations) if deviations else 0.0
    return False, round(max_dev, 2)
