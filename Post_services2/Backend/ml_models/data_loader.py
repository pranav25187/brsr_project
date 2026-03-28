import pandas as pd
from sqlalchemy import create_engine
import config

def load_branch_esg(branch_id, metric):
    """
    Loads ESG data for ONE branch and ONE metric using SQLAlchemy.
    Returns a cleaned DataFrame with 'ds' and 'y' columns for forecasting.
    """

    # 1. Validation of allowed metrics to prevent SQL injection
    allowed_metrics = [
        "energy_kwh", "energy_bill", "fuel_litres",
        "paper_reams", "waste_kg", "water_litres",
        "training_hours", "complaints_count"
    ]

    if metric not in allowed_metrics:
        print(f"Error: Metric '{metric}' is not in the allowed list.")
        return None

    try:
        # 2. Setup SQLAlchemy Engine (Prevents Pandas UserWarnings)
        user = config.DB_CONFIG['user']
        pw = config.DB_CONFIG['password']
        host = config.DB_CONFIG['host']
        db = config.DB_CONFIG['database']
        
        # Connection URI: mysql+mysqlconnector://user:password@host/database
        engine = create_engine(f"mysql+mysqlconnector://{user}:{pw}@{host}/{db}")

        # 3. Define the query
        query = f"""
            SELECT
                reporting_month AS ds,
                {metric} AS y
            FROM esg_data
            WHERE branch_id = %s
            ORDER BY reporting_month ASC
        """

        # 4. Read Data into DataFrame
        df = pd.read_sql(query, engine, params=(branch_id,))

        if df.empty:
            print(f"Warning: No data found for branch_id {branch_id}.")
            return None

        # 5. Prophet Pre-processing (MANDATORY)
        # Convert ds to datetime (Prophet requires this format)
        df["ds"] = pd.to_datetime(df["ds"])
        
        # Ensure y is numeric and drop rows with missing values
        df["y"] = pd.to_numeric(df["y"], errors="coerce")
        df = df.dropna(subset=['y', 'ds'])

        return df

    except Exception as e:
        print(f"Data Loader Error: {e}")
        return None