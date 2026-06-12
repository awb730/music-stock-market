"""We Can Ingest Artist Information and Add it to Our PostgresDB"""

from ingestion.lastfm_client import get_artist
from storage.db import upsert_artist, insert_metrics, get_connection
from datetime import datetime

ARTISTS = [
    "Drake",
    "Ken Carson",
    "Playboi Carti",
    "Che",
    "Clairo",
    "bleood",
    "Bladee",
    "OsamaSon"
]

def get_tracked_artists():
    """Also pull any artists added via search so they get updated too."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM artists;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return list(set(ARTISTS + [r[0] for r in rows]))

def run():
    artists = get_tracked_artists()
    print(f"[{datetime.now()}] Starting ingestion for {len(artists)} artists...")

    for name in artists:
        try:
            data = get_artist(name)
            artist_id = upsert_artist(data["name"], data["genres"])
            insert_metrics(artist_id, data["listeners"], data["playcount"])
            print(f"  OK {name} — Listeners: {data['listeners']:,}")
        except Exception as e:
            print(f"  FAIL {name} — Error: {e}")

    print(f"[{datetime.now()}] Ingestion complete.")

if __name__ == "__main__":
    run()