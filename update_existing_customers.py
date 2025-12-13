#!/usr/bin/env python3
"""
Analyze sales_performance data and update accounts with sales history 
to customer_status='existing' (기존 거래처)
Uses partial/fuzzy matching since company names may differ slightly
"""
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def normalize_name(name):
    """Normalize company name for comparison"""
    if not name:
        return ''
    # Remove common suffixes and clean up
    name = name.strip()
    name = name.replace('(주)', '').replace('㈜', '').replace('주식회사', '')
    name = name.replace('(유)', '').replace('유한회사', '')
    name = name.replace(' ', '').replace('.', '').replace(',', '')
    return name.lower()

def get_companies_with_sales():
    """Get unique company names from sales_performance table"""
    print("📊 판매 실적 데이터에서 업체명 추출 중...")
    
    all_companies = set()
    normalized_map = {}  # normalized -> original
    page = 0
    page_size = 1000
    
    while True:
        response = supabase.table('sales_performance')\
            .select('company_name')\
            .range(page * page_size, (page + 1) * page_size - 1)\
            .execute()
        
        if not response.data:
            break
            
        for row in response.data:
            company = row.get('company_name')
            if company and company.strip():
                original = company.strip()
                normalized = normalize_name(original)
                all_companies.add(original)
                normalized_map[normalized] = original
        
        if len(response.data) < page_size:
            break
        page += 1
    
    print(f"✅ 판매 실적에서 {len(all_companies)}개 업체 발견")
    return all_companies, normalized_map

def get_all_accounts():
    """Get all accounts from accounts table"""
    print("\n📋 accounts 테이블에서 업체 목록 조회 중...")
    
    all_accounts = []
    page = 0
    page_size = 1000
    
    while True:
        response = supabase.table('accounts')\
            .select('id, name, customer_status')\
            .range(page * page_size, (page + 1) * page_size - 1)\
            .execute()
        
        if not response.data:
            break
        
        all_accounts.extend(response.data)
        
        if len(response.data) < page_size:
            break
        page += 1
    
    print(f"✅ accounts 테이블에서 {len(all_accounts)}개 업체 발견")
    return all_accounts

def find_match(account_name, companies_set, normalized_map):
    """Find matching company using exact then fuzzy matching"""
    # Exact match
    if account_name in companies_set:
        return True, account_name
    
    # Normalized match
    normalized_account = normalize_name(account_name)
    if normalized_account in normalized_map:
        return True, normalized_map[normalized_account]
    
    # Partial match - account name contains sales company name or vice versa
    for norm_sales, orig_sales in normalized_map.items():
        if len(norm_sales) >= 3 and len(normalized_account) >= 3:
            if norm_sales in normalized_account or normalized_account in norm_sales:
                return True, orig_sales
    
    return False, None

def update_existing_customers():
    """Update accounts with sales history to 'existing' status"""
    
    # Get companies with sales
    companies_with_sales, normalized_map = get_companies_with_sales()
    
    # Get all accounts
    all_accounts = get_all_accounts()
    
    # Find matching accounts
    print("\n🔍 판매 실적과 업체명 매칭 중...")
    
    accounts_to_update = []
    for account in all_accounts:
        account_name = account.get('name', '').strip()
        current_status = account.get('customer_status', '')
        
        matched, matched_sales = find_match(account_name, companies_with_sales, normalized_map)
        
        if matched and current_status != 'existing':
            accounts_to_update.append({
                'id': account['id'],
                'name': account_name,
                'matched_sales_name': matched_sales,
                'old_status': current_status
            })
    
    if not accounts_to_update:
        print("ℹ️ 업데이트할 업체가 없습니다.")
        return
    
    print(f"\n📝 {len(accounts_to_update)}개 업체를 '기존 거래처'로 업데이트합니다:")
    
    for acc in accounts_to_update[:30]:  # Show first 30
        print(f"  - {acc['name']} ({acc['old_status']} → existing)")
        if acc['name'] != acc['matched_sales_name']:
            print(f"      ↳ 매칭: {acc['matched_sales_name']}")
    
    if len(accounts_to_update) > 30:
        print(f"  ... 외 {len(accounts_to_update) - 30}개")
    
    # Update each account
    print("\n⏳ Supabase 업데이트 중...")
    
    updated_count = 0
    for acc in accounts_to_update:
        try:
            supabase.table('accounts').update({
                'customer_status': 'existing'
            }).eq('id', acc['id']).execute()
            updated_count += 1
        except Exception as e:
            print(f"  ❌ Error updating {acc['name']}: {e}")
    
    print(f"\n✅ {updated_count}개 업체를 '기존 거래처(existing)'로 업데이트 완료!")
    
    # Show summary
    print("\n📊 업데이트 결과 요약:")
    
    # Count by status
    existing = supabase.table('accounts').select('id', count='exact').eq('customer_status', 'existing').execute()
    prospect = supabase.table('accounts').select('id', count='exact').eq('customer_status', 'prospect').execute()
    pending = supabase.table('accounts').select('id', count='exact').eq('customer_status', 'pending').execute()
    
    print(f"  🟢 기존 거래처: {existing.count if existing.count else 0}개")
    print(f"  🔴 신규/가망: {prospect.count if prospect.count else 0}개")
    print(f"  🟡 보류/기타: {pending.count if pending.count else 0}개")

if __name__ == '__main__':
    update_existing_customers()
