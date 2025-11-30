import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_업체명.xlsx'
sheet_name = '고객DB'

try:
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    print(f"\n--- Sheet: {sheet_name} ---")
    print(f"Columns: {df.columns.tolist()}")
    print("First 3 rows:")
    print(df.head(3))
except Exception as e:
    print(f"Error reading Excel file: {e}")
