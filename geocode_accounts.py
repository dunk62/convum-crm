import pandas as pd
import requests
import time
import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')
KAKAO_API_KEY = 'f83608dce1c6a2f4e533f8342d76d281'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def geocode_address(address):
    """주소를 좌표로 변환 (카카오 API)"""
    if not address:
        return None, None
    
    try:
        # 주소 검색
        response = requests.get(
            'https://dapi.kakao.com/v2/local/search/address.json',
            params={'query': address},
            headers={'Authorization': f'KakaoAK {KAKAO_API_KEY}'}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['documents']:
                doc = data['documents'][0]
                return float(doc['y']), float(doc['x'])
        
        # 주소 검색 실패 시 키워드 검색
        response = requests.get(
            'https://dapi.kakao.com/v2/local/search/keyword.json',
            params={'query': address},
            headers={'Authorization': f'KakaoAK {KAKAO_API_KEY}'}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['documents']:
                doc = data['documents'][0]
                return float(doc['y']), float(doc['x'])
        
        return None, None
    except Exception as e:
        print(f"Error geocoding '{address}': {e}")
        return None, None

# Fetch accounts without coordinates
print("Fetching accounts from Supabase...")
result = supabase.table('accounts').select('id, name, address, latitude, longitude').execute()
accounts = result.data

print(f"Total accounts: {len(accounts)}")

# Filter accounts that need geocoding (have address but no coordinates)
to_geocode = [acc for acc in accounts if acc.get('address') and not acc.get('latitude')]
print(f"Accounts to geocode: {len(to_geocode)}")

if not to_geocode:
    print("No accounts need geocoding!")
else:
    success = 0
    failed = 0
    
    for i, acc in enumerate(to_geocode):
        address = acc['address']
        lat, lng = geocode_address(address)
        
        if lat and lng:
            # Update database
            supabase.table('accounts').update({
                'latitude': lat,
                'longitude': lng
            }).eq('id', acc['id']).execute()
            
            print(f"[{i+1}/{len(to_geocode)}] ✓ {acc['name']}: ({lat}, {lng})")
            success += 1
        else:
            print(f"[{i+1}/{len(to_geocode)}] ✗ {acc['name']}: Failed")
            failed += 1
        
        # Rate limiting
        time.sleep(0.2)
    
    print(f"\n=== Geocoding Complete ===")
    print(f"Success: {success}")
    print(f"Failed: {failed}")
