from werkzeug.security import generate_password_hash
import mysql.connector
import config

def fix_passwords():
    conn = mysql.connector.connect(**config.DB_CONFIG)
    cur = conn.cursor(dictionary=True)

    # Fetch users with plain-text password
    cur.execute("""
        SELECT user_id
        FROM users
        WHERE password_hash = 'post@123'
    """)
    users = cur.fetchall()

    hashed = generate_password_hash("post@123")

    for user in users:
        cur.execute("""
            UPDATE users
            SET password_hash = %s
            WHERE user_id = %s
        """, (hashed, user["user_id"]))

    conn.commit()
    cur.close()
    conn.close()

    print("✅ Passwords fixed successfully!")

if __name__ == "__main__":
    fix_passwords()
