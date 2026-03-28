from flask import Blueprint, request, jsonify
import mysql.connector
import jwt
from functools import wraps
import config
from ml_models.anomaly_service import check_anomaly

SECRET_KEY = config.SECRET_KEY
bp = Blueprint("branch_esg", __name__, url_prefix="/api/branch_esg")

def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)

def get_user_from_db(user_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT user_id, role, branch_id FROM users WHERE user_id = %s",
        (user_id,)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401
        try:
            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401
        user = get_user_from_db(decoded.get("user_id"))
        if not user:
            return jsonify({"error": "User not found"}), 404
        return f(user, *args, **kwargs)
    return decorated

@bp.route("/submit", methods=["POST"])
@token_required
def submit_esg(user):
    if user["role"] != "branch":
        return jsonify({"error": "Unauthorized"}), 403

    branch_id = user["branch_id"]
    data = request.get_json()
    force_submit = data.get("force_submit", False)

    if not data.get("reporting_month"):
        return jsonify({"error": "reporting_month required"}), 400

    reporting_month = data["reporting_month"] + "-01"
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT energy_kwh, fuel_litres, water_litres, waste_kg, paper_reams
            FROM esg_data
            WHERE branch_id = %s
              AND reporting_month < %s
            ORDER BY reporting_month DESC
            LIMIT 6
        """, (branch_id, reporting_month))
        history = cur.fetchall()

        new_entry = {
            "energy_kwh": float(data["energy_kwh"]),
            "fuel_litres": float(data["fuel_litres"]),
            "water_litres": float(data["water_litres"]),
            "waste_kg": float(data["waste_kg"]),
            "paper_reams": float(data["paper_reams"])
        }

        is_anomaly, anomaly_score = check_anomaly(history, new_entry)

        if is_anomaly and not force_submit:
            return jsonify({
                "warning": True,
                "message": "Abnormal values detected. Please verify and re-submit to confirm."
            }), 200

        cur.execute("""
            SELECT COUNT(*) as count 
            FROM esg_data 
            WHERE branch_id = %s AND reporting_month = %s
        """, (branch_id, reporting_month))
        attempt = cur.fetchone()["count"] + 1

        cur.execute("""
            INSERT INTO esg_data (
                branch_id, reporting_month,
                energy_bill, energy_kwh, fuel_litres,
                paper_reams, waste_kg, water_litres,
                training_hours, complaints_count,
                anomaly_flag, entry_attempt
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            branch_id,
            reporting_month,
            float(data["energy_bill"]),
            new_entry["energy_kwh"],
            new_entry["fuel_litres"],
            new_entry["paper_reams"],
            new_entry["waste_kg"],
            new_entry["water_litres"],
            float(data["training_hours"]),
            int(data["complaints_count"]),
            1 if is_anomaly else 0,
            attempt
        ))

        conn.commit()
        return jsonify({
            "message": "ESG report submitted successfully",
            "anomaly_flag": 1 if is_anomaly else 0
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@bp.route("/branch_graph", methods=["GET"])
@token_required
def branch_graph(user):
    if user["role"] != "branch":
        return jsonify({"error": "Unauthorized"}), 403

    branch_id = user.get("branch_id")
    column = request.args.get("column")
    allowed_columns = [
        "energy_bill", "energy_kwh", "fuel_litres",
        "paper_reams", "waste_kg", "water_litres",
        "training_hours", "complaints_count"
    ]

    if column not in allowed_columns:
        return jsonify({"error": "Invalid column"}), 400

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    query = f"SELECT reporting_month, ROUND({column}, 2) AS value FROM esg_data WHERE branch_id = %s ORDER BY reporting_month"
    cur.execute(query, (branch_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify({"branch_id": branch_id, "column": column, "data": rows})