import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from features.momentum import analyze_all_artists

def classify_signal(features: dict) -> str:
    """Turn momentum features into a signal label."""

    # Retrieve momentum indicators from features
    growth_7d = features["listener_growth_7d"]
    growth_30d = features["listener_growth_30d"]
    acceleration = features["acceleration"]
    z_score = features["z_score"]


    # Determine a metric system to show if an artist is doing good, the same, or bad
    if growth_7d > 5 and acceleration > 0 and z_score > 1.5:
        return "BREAKOUT"
    elif growth_7d > 2 and growth_30d > 5:
        return "RISING"
    elif growth_7d < -2 and acceleration < 0:
        return "COOLING"
    elif z_score < -1 and growth_30d < 1:
        return "DORMANT"
    else:
        return "STABLE"
    
def run_singals():
    artists = analyze_all_artists()
    results = []

    for artist in artists:
        signal = classify_signal(artist)
        results.append({
            "name": artist["name"],
            "signal": signal,
            "listener_growth_7d": artist["listener_growth_7d"],
            "listener_growth_30d": artist["listener_growth_30d"],
            "acceleration": artist["acceleration"],
            "z_score": artist["z_score"]
        })

    # Sort by signal priority
    priority = {"BREAKOUT": 0, "RISING": 1, "STABLE": 2, "COOLING": 3, "DORMANT": 4}
    results.sort(key=lambda x: priority.get(x["signal"], 99))

    return results

if __name__ == "__main__":
    results = run_singals()
    print(f"\n{'ARTIST':<20} {'SIGNAL':<12} {'7D%':<10} {'30D%':<10} {'ACCEL':<10} {'Z'}")
    print("-" * 70)
    for r in results:
        print(f"{r['name']:<20} {r['signal']:<12} {r['listener_growth_7d']:<10} {r['listener_growth_30d']:<10} {r['acceleration']:<10} {r['z_score']}")