#!/usr/bin/env python3
"""
Update accounts with industry '로봇' to customer_status 'prospect' (신규/가망)
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL') or os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY') or os.getenv('SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    # Fallback to hardcoded values from .env
    SUPABASE_URL = 'https://rjilxlopauzwzwqmdcre.supabase.co'
    SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaWx4bG9wYXV6d3p3cW1kY3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMjU3MjQsImV4cCI6MjA0NzkwMTcyNH0.sb_publishable_i3pCGKzhZigmcdzMLG5T4w_WytHiH1-'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_robot_industry_accounts():
    """Update all accounts with industry='로봇' to customer_status='prospect'"""
    
    # First, find all accounts with industry='로봇'
    print("Finding accounts with industry='로봇'...")
    response = supabase.table('accounts').select('id, name, industry, customer_status').eq('industry', '로봇').execute()
    
    if not response.data:
        print("No accounts found with industry='로봇'")
        return
    
    print(f"Found {len(response.data)} accounts with industry='로봇':")
    for acc in response.data:
        print(f"  - {acc['name']} (현재 상태: {acc.get('customer_status', 'N/A')})")
    
    # Update all of them to 'prospect'
    print("\nUpdating customer_status to 'prospect' (신규/가망)...")
    
    update_response = supabase.table('accounts').update({
        'customer_status': 'prospect'
    }).eq('industry', '로봇').execute()
    
    print(f"✅ Updated {len(response.data)} accounts to 'prospect' status")
    
    # Verify the update
    print("\nVerifying update...")
    verify_response = supabase.table('accounts').select('id, name, industry, customer_status').eq('industry', '로봇').execute()
    
    for acc in verify_response.data:
        status = acc.get('customer_status', 'N/A')
        status_emoji = '✅' if status == 'prospect' else '❌'
        print(f"  {status_emoji} {acc['name']}: {status}")
    
    print("\n🎉 Done!")

if __name__ == '__main__':
    update_robot_industry_accounts()
