import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Ensure backend imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routes.source_reviews import (
    fetch_serp_reviews,
    fetch_reddit_reviews,
    fetch_trustpilot_reviews,
    fetch_g2_reviews,
    get_all_reviews
)

def test_routes():
    print("==================================================")
    print("🚀 TARGET ACQUIRED: INITIALIZING SCRAPER TESTER")
    print("==================================================")
    
    serp_key = os.environ.get("VITE_SERP_API_KEY") or os.environ.get("SERPAPI_KEY")
    reddit_cid = os.environ.get("REDDIT_CLIENT_ID")
    
    print("\n[✔] Validating API Keys...")
    print(f"    - SERP API Key     : {'LOADED' if serp_key else 'MISSING (401 expected)'}")
    print(f"    - REDDIT Client ID : {'LOADED' if reddit_cid else 'MISSING (Reddit will return 0)'}")
    
    print("\n--------------------------------------------------")
    print("🔍 1. Testing SERP Google Maps API")
    serp = fetch_serp_reviews()
    print(f"    Returned: {len(serp)} objects")
    if serp:
        print(f"    Sample: {serp[0]}")
        
    print("\n--------------------------------------------------")
    print("🔍 2. Testing Reddit Sentiment Extractor")
    reddit = fetch_reddit_reviews()
    print(f"    Returned: {len(reddit)} posts")
    if reddit:
        print(f"    Sample: {reddit[0]}")
        
    print("\n--------------------------------------------------")
    print("🔍 3. Testing Trustpilot Scraper")
    trustpilot = fetch_trustpilot_reviews()
    print(f"    Returned: {len(trustpilot)} reviews")
    if trustpilot:
        print(f"    Sample: {trustpilot[0]}")
        
    print("\n--------------------------------------------------")
    print("🔍 4. Testing G2 Scraper")
    g2 = fetch_g2_reviews()
    print(f"    Returned: {len(g2)} reviews")
    if g2:
        print(f"    Sample: {g2[0]}")
        
    print("\n==================================================")
    print("🏁 TEST COMPLETE")
    print("==================================================")

if __name__ == "__main__":
    test_routes()
