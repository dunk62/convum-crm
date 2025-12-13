"""
Migration Script: Link existing opportunities to accounts via account_id

This script:
1. Fetches all opportunities with company names
2. Matches them with accounts by name
3. Updates opportunities with the corresponding account_id
"""

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def migrate_opportunities():
    print("🚀 Starting migration: Linking opportunities to accounts...")
    
    # 1. Fetch all accounts
    print("📦 Fetching accounts...")
    accounts_response = supabase.table("accounts").select("id, name").execute()
    accounts = accounts_response.data
    
    # Create a lookup dictionary (lowercase name -> id)
    account_lookup = {}
    for acc in accounts:
        if acc.get("name"):
            # Normalize name for matching
            normalized_name = acc["name"].strip().lower()
            account_lookup[normalized_name] = acc["id"]
    
    print(f"✅ Found {len(account_lookup)} accounts")
    
    # 2. Fetch all opportunities without account_id
    print("📦 Fetching opportunities...")
    opportunities_response = supabase.table("opportunities").select("id, company, account_id").execute()
    opportunities = opportunities_response.data
    
    print(f"✅ Found {len(opportunities)} opportunities")
    
    # 3. Match and update
    matched = 0
    unmatched = []
    already_linked = 0
    
    for opp in opportunities:
        # Skip if already has account_id
        if opp.get("account_id"):
            already_linked += 1
            continue
        
        company_name = opp.get("company")
        if not company_name:
            continue
        
        # Try to find matching account
        normalized_company = company_name.strip().lower()
        account_id = account_lookup.get(normalized_company)
        
        if account_id:
            # Update the opportunity
            supabase.table("opportunities").update({
                "account_id": account_id
            }).eq("id", opp["id"]).execute()
            matched += 1
            print(f"  ✅ Linked: {company_name} -> {account_id}")
        else:
            unmatched.append(company_name)
    
    # 4. Summary
    print("\n" + "=" * 50)
    print("📊 Migration Summary")
    print("=" * 50)
    print(f"✅ Successfully linked: {matched}")
    print(f"⏭️  Already linked: {already_linked}")
    print(f"⚠️  Unmatched (no account found): {len(unmatched)}")
    
    if unmatched:
        print("\n⚠️  Unmatched companies:")
        for company in set(unmatched):  # Remove duplicates
            print(f"   - {company}")
    
    print("\n🎉 Migration completed!")

if __name__ == "__main__":
    migrate_opportunities()
