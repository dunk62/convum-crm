"""
남은 5개 형번의 상품군을 수동으로 업데이트하는 스크립트
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

# 수동 수정할 형번과 올바른 상품군 매핑
manual_fixes = {
    'BBPJYK-20-S': 'PAD金具',
    'BMC42S05HRZZ5B': 'Ejector(CONVUM)',
    'BMC22S07HSVGL5BLR': 'Ejector(CONVUM)',
    'PCG-5-EC': 'PAD',
    'BMC22M07LSVGL5BLR312L': 'Ejector(CONVUM)',
}

print("남은 5개 형번 상품군 업데이트 중...")

for model_number, correct_product_name in manual_fixes.items():
    # 해당 형번의 BLUE/RED 레코드 업데이트
    result = supabase.table('sales_performance').update({
        'product_name': correct_product_name
    }).eq('model_number', model_number).in_('product_name', ['BLUE', 'RED']).execute()
    
    updated_count = len(result.data) if result.data else 0
    print(f"  {model_number}: {correct_product_name} - {updated_count}개 업데이트")

# 결과 확인
print("\n최종 확인:")
remaining_blue = supabase.table('sales_performance').select('id', count='exact').eq('product_name', 'BLUE').execute()
remaining_red = supabase.table('sales_performance').select('id', count='exact').eq('product_name', 'RED').execute()

print(f"  남은 BLUE 레코드: {remaining_blue.count}")
print(f"  남은 RED 레코드: {remaining_red.count}")
print("\n완료!")
