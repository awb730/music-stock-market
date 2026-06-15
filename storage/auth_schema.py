import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from storage.db import get_connection

def create_auth_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            credits INTEGER DEFAULT 1000,
            created_at TIMESTAMP DEFAULT NOW()
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS positions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            artist_id INTEGER REFERENCES artists(id),
            direction VARCHAR(10) NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
            credits_wagered INTEGER NOT NULL,
            listener_count_at_open INTEGER NOT NULL,
            status VARCHAR(10) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
            pnl INTEGER DEFAULT 0,
            opened_at TIMESTAMP DEFAULT NOW(),
            closed_at TIMESTAMP
        );
    """)

    conn.commit()
    cursor.close()
    conn.close()
    print("Auth tables created successfully.")

if __name__ == "__main__":
    create_auth_tables()