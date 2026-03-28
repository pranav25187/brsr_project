from flask import Blueprint, jsonify, request
import mysql.connector
import jwt
from functools import wraps
import config

SECRET_KEY = config.SECRET_KEY
bp = Blueprint("anomaly", __name__, url_prefix="/api/anomalies")


# ===============================
# DB Helper
# ===============================
def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)


def get_user(user_id):
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


# ===============================
# JWT Decorator
# ===============================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth:
            return jsonify({"error": "Missing token"}), 401

        try:
            token = auth.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        user = get_user(decoded["user_id"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        return f(user, *args, **kwargs)

    return decorated


# ===============================
# DIVISION: View Branch Anomalies
# ===============================
@bp.route("/division", methods=["GET"])
@token_required
def division_anomalies(user):

    if user["role"] != "division":
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user["branch_id"]
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT
            b.branch_code,
            b.branch_name,
            e.reporting_month,
            e.energy_kwh,
            e.fuel_litres,
            e.water_litres,
            e.waste_kg,
            e.paper_reams,
            e.entry_attempt,
            e.created_at
        FROM esg_data e
        JOIN branches b ON e.branch_id = b.branch_id
        WHERE b.parent_id = %s
        AND e.anomaly_flag = 1
        ORDER BY e.created_at DESC
    """, (division_id,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify({
        "role": "division",
        "division_id": division_id,
        "anomalies": data
    })


# ===============================
# CIRCLE: View All Anomalies
# ===============================
@bp.route("/circle", methods=["GET"])
@token_required
def circle_anomalies(user):

    if user["role"] != "circle":
        return jsonify({"error": "Unauthorized"}), 403

    circle_id = user["branch_id"]
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT
            div.branch_code AS division_code,
            b.branch_code AS branch_code,
            b.branch_name,
            e.reporting_month,
            e.energy_kwh,
            e.fuel_litres,
            e.water_litres,
            e.waste_kg,
            e.paper_reams,
            e.entry_attempt,
            e.created_at
        FROM esg_data e
        JOIN branches b ON e.branch_id = b.branch_id
        JOIN branches div ON b.parent_id = div.branch_id
        WHERE div.parent_id = %s
        AND e.anomaly_flag = 1
        ORDER BY e.created_at DESC
    """, (circle_id,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify({
        "role": "circle",
        "circle_id": circle_id,
        "anomalies": data
    })
