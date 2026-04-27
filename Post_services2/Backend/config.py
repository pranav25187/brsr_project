import os

DB_CONFIG = {
    'host': os.getenv('MYSQLHOST'),
    'user': os.getenv('MYSQLUSER'),
    'password': os.getenv('MYSQLPASSWORD'),
    'database': os.getenv('MYSQLDATABASE'),
    'port': int(os.getenv('MYSQLPORT'))
}

print("🔥 DB CONFIG:", DB_CONFIG)
# Secret key for sessions (for Flask-JWT or session management)
SECRET_KEY = 'my_super_secret_key_12345'
