"""We Can Successfully Fetch From LastFm API"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

# CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "")
# CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "")
API_KEY = os.getenv("LASTFM_API_KEY", "")
BASE_URL = "https://ws.audioscrobbler.com/2.0/"

def get_artist(artist_name: str) -> dict:
    """Fetch artist data from Last.fm by artist name."""
    """Send out an HTTP request using requests library to retrieve artist info at the BASE_URL"""
    response = requests.get(
        BASE_URL,
        params={
            "method": "artist.getinfo",
            "artist": artist_name,
            "api_key": API_KEY,
            "format": "json",
        }
    )
    response.raise_for_status()
    data = response.json()

    artist = data["artist"]
    return {
        "name": artist["name"],
        "listeners": int(artist["stats"]["listeners"]),
        "playcount": int(artist["stats"]["playcount"]),
        "genres": [tag["name"] for tag in artist["tags"]["tag"]]
    }

if __name__ == "__main__":
    artist = get_artist("Kendrick Lamar")
    print(f"Name: {artist['name']}")
    print(f"Listeners: {artist['listeners']:,}")
    print(f"Playcount: {artist['playcount']:,}")
    print(f"Genres: {', '.join(artist['genres'])}")