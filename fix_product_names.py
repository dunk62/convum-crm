"""
상품군이 BLUE/RED로 잘못 들어간 레코드를 동일 형번의 올바른 상품군 값으로 수정하는 스크립트
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

def fix_product_names():
    # 1. 잘못된 상품군 (BLUE, RED) 레코드 조회
    print("1. 잘못된 상품군(BLUE, RED) 레코드 조회 중...")
    
    # BLUE 레코드
    blue_records = supabase.table('sales_performance').select('id, model_number, product_name').eq('product_name', 'BLUE').execute()
    red_records = supabase.table('sales_performance').select('id, model_number, product_name').eq('product_name', 'RED').execute()
    
    bad_records = blue_records.data + red_records.data
    print(f"   발견된 잘못된 레코드 수: {len(bad_records)}")
    
    if not bad_records:
        print("   수정할 레코드가 없습니다.")
        return
    
    # 2. 잘못된 형번 목록 추출
    bad_model_numbers = list(set([r['model_number'] for r in bad_records]))
    print(f"   잘못된 형번 수: {len(bad_model_numbers)}")
    print(f"   형번 목록: {bad_model_numbers[:10]}...")
    
    # 3. 각 형번에 대해 올바른 상품군 찾기
    print("\n2. 각 형번에 대해 올바른 상품군 찾기...")
    correct_product_names = {}
    
    for model_number in bad_model_numbers:
        # 동일 형번에서 BLUE/RED가 아닌 상품군 찾기
        result = supabase.table('sales_performance').select('product_name').eq('model_number', model_number).not_.in_('product_name', ['BLUE', 'RED', None, '']).limit(1).execute()
        
        if result.data and result.data[0].get('product_name'):
            correct_product_names[model_number] = result.data[0]['product_name']
            print(f"   {model_number}: {result.data[0]['product_name']}")
        else:
            print(f"   {model_number}: 올바른 상품군을 찾을 수 없음 (수동 확인 필요)")
    
    # 4. 레코드 업데이트
    print("\n3. Supabase 레코드 업데이트 중...")
    updated_count = 0
    skipped_count = 0
    
    for record in bad_records:
        model_number = record['model_number']
        record_id = record['id']
        
        if model_number in correct_product_names:
            new_product_name = correct_product_names[model_number]
            result = supabase.table('sales_performance').update({'product_name': new_product_name}).eq('id', record_id).execute()
            updated_count += 1
        else:
            skipped_count += 1
    
    print(f"\n=== 완료 ===")
    print(f"업데이트된 레코드: {updated_count}개")
    print(f"스킵된 레코드 (올바른 상품군 없음): {skipped_count}개")
    
    # 5. 결과 확인
    print("\n4. 업데이트 결과 확인...")
    remaining_blue = supabase.table('sales_performance').select('id', count='exact').eq('product_name', 'BLUE').execute()
    remaining_red = supabase.table('sales_performance').select('id', count='exact').eq('product_name', 'RED').execute()
    
    print(f"   남은 BLUE 레코드: {remaining_blue.count}")
    print(f"   남은 RED 레코드: {remaining_red.count}")

if __name__ == "__main__":
    fix_product_names()
