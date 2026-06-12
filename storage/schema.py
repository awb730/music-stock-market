import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

def create_tables():
    conn = get_connection() # gets connection to db
    cursor = conn.cursor() # provides execution to query SQL commands

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS artists (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            genres TEXT[],
            created_at TIMESTAMP DEFAULT NOW()
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS artist_metrics (
            id SERIAL PRIMARY KEY,
            artist_id INTEGER REFERENCES artists(id),
            listeners INTEGER,
            playcount INTEGER,
            recorded_at TIMESTAMP DEFAULT NOW()
        );
    """)

    conn.commit()
    cursor.close()
    conn.close()
    print("Tables created successfully.")

if __name__ == "__main__":
    create_tables()