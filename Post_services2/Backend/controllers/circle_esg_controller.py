from flask import Blueprint, request, jsonify
import mysql.connector
from functools import wraps
import jwt
import config

SECRET_KEY = config.SECRET_KEY

bp = Blueprint("circle_esg", __name__, url_prefix="/api/circle_esg")

def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Token missing"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(data, *args, **kwargs)
    return decorated

# ===============================
# Circle Graph Data
# ===============================
@bp.route("/circle_graph", methods=["GET"])
@token_required
def circle_graph(user):
    if user["role"] != "circle":
        return jsonify({"error": "Unauthorized"}), 403

    circle_id = user.get("branch_id")
    column = request.args.get("column")

    allowed_columns = [
        "energy_bill", "energy_kwh", "fuel_litres",
        "paper_reams", "waste_kg", "water_litres",
        "training_hours", "complaints_count",
    ]

    if column not in allowed_columns:
        return jsonify({"error": "Invalid column"}), 400

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # REPLACED 'div' alias with 'dv' to avoid MySQL reserved word conflict
    query = f"""
        SELECT 
            reporting_month,
            ROUND(AVG(value), 2) AS avg_value
        FROM (
            -- Branch level data
            SELECT 
                e.reporting_month,
                e.{column} AS value
            FROM esg_data e
            JOIN branches b ON e.branch_id = b.branch_id
            JOIN branches d ON b.parent_id = d.branch_id
            WHERE d.parent_id = %s

            UNION ALL

            -- Division level data
            SELECT 
                d2.reporting_month,
                d2.{column} AS value
            FROM division_esg_data d2
            JOIN branches dv ON d2.division_id = dv.branch_id
            WHERE dv.parent_id = %s
        ) combined
        GROUP BY reporting_month
        ORDER BY STR_TO_DATE(CONCAT(reporting_month, '-01'), '%Y-%m-%d') ASC
    """

    try:
        cur.execute(query, (circle_id, circle_id))
        rows = cur.fetchall()
    except mysql.connector.Error as err:
        return jsonify({"error": "Database query failed", "details": str(err)}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({
        "circle_id": circle_id,
        "column": column,
        "data": rows
    })