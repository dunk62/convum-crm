import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'
sheet_name = '고객DB'

try:
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    print(f"Sheet '{sheet_name}' has {len(df)} rows.")
except Exception as e:
    print(f"Error reading sheet: {e}")
