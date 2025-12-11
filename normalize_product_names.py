#!/usr/bin/env python3
"""
기존 sales_performance, order_performance 테이블의 RED/BLUE/NO LOGO 값을
model_product_mapping 테이블을 참조하여 올바른 상품군으로 업데이트
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

INVALID_PRODUCT_NAMES = ['RED', 'BLUE', 'NO LOGO']

def load_mappings():
    """매핑 테이블에서 형번-상품군 매핑 로드"""
    print("Loading model-product mappings...")
    mappings = {}
    page = 0
    page_size = 1000
    
    while True:
        response = supabase.table('model_product_mapping')\
            .select('model_number, product_name')\
            .range(page * page_size, (page + 1) * page_size - 1)\
            .execute()
        
        if not response.data:
            break
            
        for row in response.data:
            mn = (row.get('model_number') or '').strip()
            pn = (row.get('product_name') or '').strip()
            if mn and pn:
                mappings[mn] = pn
                
        if len(response.data) < page_size:
            break
        page += 1
    
    print(f"Loaded {len(mappings)} mappings")
    return mappings

def normalize_table(table_name: str, date_column: str, mappings: dict):
    """테이블의 잘못된 상품군 정규화"""
    print(f"\nProcessing {table_name}...")
    
    # 잘못된 상품군을 가진 레코드 조회
    page = 0
    page_size = 500
    total_updated = 0
    
    while True:
        response = supabase.table(table_name)\
            .select('id, model_number, product_name')\
            .in_('product_name', INVALID_PRODUCT_NAMES)\
            .range(page * page_size, (page + 1) * page_size - 1)\
            .execute()
        
        if not response.data:
            break
        
        print(f"Found {len(response.data)} records with invalid product names (page {page + 1})")
        
        # 각 레코드 업데이트
        for record in response.data:
            record_id = record['id']
            mn = (record.get('model_number') or '').strip()
            
            if mn and mn in mappings:
                valid_pn = mappings[mn]
                try:
                    supabase.table(table_name)\
                        .update({'product_name': valid_pn})\
                        .eq('id', record_id)\
                        .execute()
                    total_updated += 1
                except Exception as e:
                    print(f"Error updating {record_id}: {e}")
        
        if len(response.data) < page_size:
            break
        page += 1
    
    print(f"Updated {total_updated} records in {table_name}")
    return total_updated

def check_remaining():
    """아직 정규화되지 않은 레코드 수 확인"""
    for table in ['sales_performance', 'order_performance']:
        response = supabase.table(table)\
            .select('id', count='exact')\
            .in_('product_name', INVALID_PRODUCT_NAMES)\
            .execute()
        print(f"{table}: {response.count} remaining with RED/BLUE/NO LOGO")

def main():
    print("=" * 50)
    print("상품군 정규화 스크립트")
    print("=" * 50)
    
    # 매핑 로드
    mappings = load_mappings()
    
    if not mappings:
        print("Error: No mappings found! Run the SQL script first to create model_product_mapping table.")
        return
    
    # 각 테이블 정규화
    normalize_table('sales_performance', 'shipment_date', mappings)
    normalize_table('order_performance', 'order_date', mappings)
    
    # 결과 확인
    print("\n" + "=" * 50)
    print("Verification:")
    check_remaining()
    print("=" * 50)

if __name__ == '__main__':
    main()
