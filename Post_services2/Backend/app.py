from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = "my_super_secret_key_12345"

from controllers import (
    auth_controller,
    dashboard_controller,
    division_esg_controller,
    branch_esg_controller,
    validate_controller,
    fetch_data_controller,
    anomaly_controller
)
from controllers.circle_esg_controller import bp as circle_esg_bp
app.register_blueprint(circle_esg_bp)

from controllers.branch_forecast_controller import bp as branch_forecast_bp

app.register_blueprint(branch_forecast_bp)


# Enable CORS
CORS(app)

# Register Blueprints
app.register_blueprint(auth_controller.bp, url_prefix="/api/auth")
app.register_blueprint(dashboard_controller.bp, url_prefix="/api/dashboard")
app.register_blueprint(division_esg_controller.bp, url_prefix="/api/division_esg")
app.register_blueprint(branch_esg_controller.bp, url_prefix="/api/branch_esg")
app.register_blueprint(validate_controller.bp, url_prefix="/api/validate")
app.register_blueprint(fetch_data_controller.bp, url_prefix="/api/fetch_data")
app.register_blueprint(anomaly_controller.bp)

# Ensure reports folder exists
if not os.path.exists('reports'):
    os.makedirs('reports')
    
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "API running"})

if __name__ == '__main__':
    app.run(debug=True)