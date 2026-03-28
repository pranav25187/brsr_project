import pandas as pd
import numpy as np

def generate_synthetic_esg_data(
    branch_id=1,
    start_date="2023-01-01",
    months=24,
    anomaly_ratio=0.1,
    random_seed=42
):
    np.random.seed(random_seed)

    dates = pd.date_range(start=start_date, periods=months, freq="MS")

    data = []
    base_energy = np.random.randint(4000, 7000)
    base_fuel = np.random.randint(200, 350)
    base_water = np.random.randint(9000, 13000)
    base_waste = np.random.randint(120, 200)
    base_paper = np.random.randint(80, 120)
    base_training = np.random.randint(40, 70)

    for i, date in enumerate(dates):
        seasonal_factor = 1 + 0.1 * np.sin(2 * np.pi * i / 12)

        energy = base_energy * seasonal_factor * np.random.uniform(0.95, 1.05)
        fuel = base_fuel * np.random.uniform(0.95, 1.05)
        water = base_water * seasonal_factor * np.random.uniform(0.95, 1.05)
        waste = base_waste * np.random.uniform(0.95, 1.05)
        paper = base_paper * np.random.uniform(0.95, 1.05)
        training = base_training * np.random.uniform(0.9, 1.1)

        is_anomaly = 0

        # Inject anomaly
        if np.random.rand() < anomaly_ratio:
            spike_factor = np.random.choice([0.3, 2.5])
            energy *= spike_factor
            fuel *= spike_factor
            water *= spike_factor
            is_anomaly = 1

        data.append([
            branch_id,
            date,
            round(energy, 2),
            round(fuel, 2),
            round(water, 2),
            round(waste, 2),
            round(paper, 2),
            round(training, 2),
            is_anomaly
        ])

    df = pd.DataFrame(data, columns=[
        "branch_id",
        "reporting_month",
        "energy_kwh",
        "fuel_litres",
        "water_litres",
        "waste_kg",
        "paper_reams",
        "training_hours",
        "is_anomaly"
    ])

    return df


if __name__ == "__main__":
    df = generate_synthetic_esg_data(branch_id=11)
    df.to_csv("synthetic_esg_data.csv", index=False)
    print("Synthetic ESG dataset generated successfully")
