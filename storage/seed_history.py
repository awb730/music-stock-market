"""Makes mock seed data of artist metrics for 30 days"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from storage.db import get_connection

def seed():
    """Seed fake historical snapshots so we can compute momentum."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM artists;")
    artists = cursor.fetchall()

    import random
    from datetime import datetime, timedelta

    for artist_id, name in artists:
        print(f"Seeding history for {name}...")

        # Get their current metrics
        cursor.execute("""
            SELECT listeners, playcount FROM artist_metrics
            WHERE artist_id = %s ORDER BY recorded_at DESC LIMIT 1;
        """, (artist_id,))
        row = cursor.fetchone()
        if not row:
            continue

        listeners, playcount = row
        
        # Insert 29 fake historical snapshots going back 29 days
        for days_ago in range(29, 0, -1):
            factor = 1 - (days_ago * random.uniform(0.001, 0.003))
            fake_listeners = int(listeners * factor)
            fake_playcount = int(playcount * factor)
            fake_date = datetime.now() - timedelta(days=days_ago)

            cursor.execute("""
                INSERT INTO artist_metrics (artist_id, listeners, playcount, recorded_at)
                VALUES (%s, %s, %s, %s);
            """, (artist_id, fake_listeners, fake_playcount, fake_date))

    conn.commit()
    cursor.close()
    conn.close()
    print("History seeded.")

def seed_artist(artist_id: int):
    """Seed history for a single artist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT listeners, playcount FROM artist_metrics
        WHERE artist_id = %s ORDER BY recorded_at DESC LIMIT 1;
    """, (artist_id,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return

    listeners, playcount = row

    import random
    from datetime import datetime, timedelta

    for days_ago in range(29, 0, -1):
        factor = 1 - (days_ago * random.uniform(0.001, 0.003))
        fake_listeners = int(listeners * factor)
        fake_playcount = int(playcount * factor)
        fake_date = datetime.now() - timedelta(days=days_ago)

        cursor.execute("""
            INSERT INTO artist_metrics (artist_id, listeners, playcount, recorded_at)
            VALUES (%s, %s, %s, %s);
        """, (artist_id, fake_listeners, fake_playcount, fake_date))

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    seed()
