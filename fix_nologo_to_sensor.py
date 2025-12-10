"""
no logo 상품군을 sensor로 수정하는 스크립트
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

# 수정할 형번 목록
model_numbers_to_fix = [
    'F02-202-010-F10C',
    'F02-202-04-F10C',
    'F02-501-030-F7C',
    'F02-202-02-F10C',
    'F02-202-011-F10C',
    'FP02-102-02-F7C',
    'KT-77D-5M',
    'BT-28',
]

print("no logo → SENSOR 상품군 업데이트 중...")

total_updated = 0
for model_number in model_numbers_to_fix:
    result = supabase.table('sales_performance').update({
        'product_name': 'SENSOR'
    }).eq('model_number', model_number).execute()
    
    updated_count = len(result.data) if result.data else 0
    total_updated += updated_count
    print(f"  {model_number}: {updated_count}개 업데이트")

print(f"\n총 {total_updated}개 레코드 업데이트 완료!")
