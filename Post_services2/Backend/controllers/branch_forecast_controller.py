from flask import Blueprint, request, jsonify
from ml_models.data_loader import load_branch_esg
from ml_models.branch_forecast_model import forecast_branch
from functools import wraps
import jwt
import config

SECRET_KEY = config.SECRET_KEY

bp = Blueprint("branch_forecast", __name__, url_prefix="/api/branch_forecast")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        return f(data, *args, **kwargs)
    return decorated

@bp.route("", methods=["GET"])
@token_required
def branch_forecast_route(user):
    if user["role"] != "branch":
        return jsonify({"error": "Only branch users allowed"}), 403

    branch_id = user["branch_id"]
    metric = request.args.get("metric", "energy_kwh")

    # Load historical data
    df = load_branch_esg(branch_id, metric)

    if df is None or len(df) < 6:
        return jsonify({"error": "Not enough historical data (min 6 months required)"}), 400

    # Call updated forecast function with branch_id for model persistence
    forecast_df = forecast_branch(df, branch_id, metric)

    response = []
    for _, row in forecast_df.iterrows():
        response.append({
            "month": row["ds"].strftime("%Y-%m"),
            "predicted": round(row["yhat"], 2),
            "lower": round(row["yhat_lower"], 2),
            "upper": round(row["yhat_upper"], 2)
        })

    return jsonify({
        "branch_id": branch_id,
        "metric": metric,
        "year": 2026,
        "forecast": response
    })