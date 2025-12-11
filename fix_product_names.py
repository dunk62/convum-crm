#!/usr/bin/env python3
"""
상품군이 RED, BLUE, NO LOGO인 레코드를 동일 형번의 올바른 상품군으로 업데이트
"""

import os
from supabase import create_client

# Supabase 연결
SUPABASE_URL = 'https://ezdsffsgtwgeevnmaccx.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZHNmZnNndHdnZWV2bm1hY2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzAwNTIsImV4cCI6MjA2MjYwNjA1Mn0.kSKkJz5n2_nD2l0BbBTbH5dlPWRJQ3p2OAEE0rkF9iI'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

INVALID_PRODUCT_NAMES = ['RED', 'BLUE', 'NO LOGO']

def fix_product_names():
    print("=" * 60)
    print("상품군 정규화 시작 (RED, BLUE, NO LOGO → 올바른 상품군)")
    print("=" * 60)
    
    # 1. 올바른 형번-상품군 매핑 조회
    print("\n[1단계] 형번-상품군 매핑 조회 중...")
    
    # 전체 조회 (페이지네이션 필요할 수 있음)
    all_records = []
    page = 0
    page_size = 1000
    
    while True:
        response = supabase.table('sales_performance')\
            .select('model_number, product_name')\
            .range(page * page_size, (page + 1) * page_size - 1)\
            .execute()
        
        if not response.data:
            break
        all_records.extend(response.data)
        if len(response.data) < page_size:
            break
        page += 1
    
    model_to_product = {}
    for record in all_records:
        product_name = (record.get('product_name') or '').strip()
        model_number = (record.get('model_number') or '').strip()
        
        # 유효한 상품군만 매핑에 저장
        if model_number and product_name and product_name.upper() not in INVALID_PRODUCT_NAMES:
            model_to_product[model_number] = product_name
    
    print(f"   → {len(model_to_product)}개 형번 매핑 완료")
    
    # 2. sales_performance에서 잘못된 상품군 조회 및 업데이트
    print("\n[2단계] sales_performance 테이블 업데이트 중...")
    
    for invalid_name in INVALID_PRODUCT_NAMES:
        sales_invalid = supabase.table('sales_performance')\
            .select('id, model_number, product_name')\
            .eq('product_name', invalid_name)\
            .execute()
        
        updated_count = 0
        for record in sales_invalid.data:
            model_number = (record.get('model_number') or '').strip()
            if model_number and model_number in model_to_product:
                correct_product_name = model_to_product[model_number]
                supabase.table('sales_performance')\
                    .update({'product_name': correct_product_name})\
                    .eq('id', record['id'])\
                    .execute()
                updated_count += 1
        
        print(f"   → '{invalid_name}': {len(sales_invalid.data)}건 중 {updated_count}건 업데이트")
    
    # 3. order_performance에서 잘못된 상품군 조회 및 업데이트
    print("\n[3단계] order_performance 테이블 업데이트 중...")
    
    for invalid_name in INVALID_PRODUCT_NAMES:
        order_invalid = supabase.table('order_performance')\
            .select('id, model_number, product_name')\
            .eq('product_name', invalid_name)\
            .execute()
        
        updated_count = 0
        for record in order_invalid.data:
            model_number = (record.get('model_number') or '').strip()
            if model_number and model_number in model_to_product:
                correct_product_name = model_to_product[model_number]
                supabase.table('order_performance')\
                    .update({'product_name': correct_product_name})\
                    .eq('id', record['id'])\
                    .execute()
                updated_count += 1
        
        print(f"   → '{invalid_name}': {len(order_invalid.data)}건 중 {updated_count}건 업데이트")
    
    # 4. 결과 확인
    print("\n[4단계] 결과 확인...")
    
    remaining_sales = 0
    remaining_order = 0
    
    for invalid_name in INVALID_PRODUCT_NAMES:
        sales_check = supabase.table('sales_performance')\
            .select('id')\
            .eq('product_name', invalid_name)\
            .execute()
        remaining_sales += len(sales_check.data)
        
        order_check = supabase.table('order_performance')\
            .select('id')\
            .eq('product_name', invalid_name)\
            .execute()
        remaining_order += len(order_check.data)
    
    print(f"   → sales_performance 남은 건수: {remaining_sales}")
    print(f"   → order_performance 남은 건수: {remaining_order}")
    
    print("\n" + "=" * 60)
    print("상품군 정규화 완료!")
    print("=" * 60)

if __name__ == '__main__':
    fix_product_names()
