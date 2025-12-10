import pandas as pd
import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load CSV
csv_path = '/Users/hyeonhotak/Downloads/코딩/치환_CRM_데이터베이스.csv'
df = pd.read_csv(csv_path)

print(f"Loaded {len(df)} records")

# Prepare data for Supabase
records = []
for _, row in df.iterrows():
    # Skip rows without both competitor and convum model
    if pd.isna(row['타사 모델(원본)']) and pd.isna(row['당사 대응 모델']):
        continue
    
    record = {
        'maker': str(row['Maker']) if pd.notna(row['Maker']) else '',
        'competitor_model': str(row['타사 모델(원본)']) if pd.notna(row['타사 모델(원본)']) else '',
        'search_keyword': str(row['검색 키워드(Clean)']) if pd.notna(row['검색 키워드(Clean)']) else '',
        'convum_model': str(row['당사 대응 모델']) if pd.notna(row['당사 대응 모델']) else '',
        'compatibility_grade': str(row['호환 등급']) if pd.notna(row['호환 등급']) else 'A',
        'tech_checkpoint': str(row['기술 체크포인트(요약)']) if pd.notna(row['기술 체크포인트(요약)']) else '',
        'sales_point': str(row['영업 제안']) if pd.notna(row['영업 제안']) else ''
    }
    records.append(record)

print(f"Prepared {len(records)} records for import")

# Import in batches
batch_size = 100
success_count = 0
fail_count = 0

for i in range(0, len(records), batch_size):
    batch = records[i:i+batch_size]
    try:
        result = supabase.table('cross_references').insert(batch).execute()
        success_count += len(batch)
        print(f"Batch {i//batch_size + 1}: Inserted {len(batch)} records")
    except Exception as e:
        print(f"Batch {i//batch_size + 1} Error: {e}")
        fail_count += len(batch)

print(f"\n=== Import Complete ===")
print(f"Success: {success_count}")
print(f"Failed: {fail_count}")
