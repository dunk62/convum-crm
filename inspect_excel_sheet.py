import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'
sheet_name = '고객DB'

try:
    print(f"Inspecting sheet: {sheet_name}")
    df = pd.read_excel(file_path, sheet_name=sheet_name, nrows=5)
    print("Columns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head())
except Exception as e:
    print(f"Error reading sheet '{sheet_name}': {e}")
