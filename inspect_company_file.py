import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_업체명.xlsx'

try:
    xl = pd.ExcelFile(file_path)
    print(f"Sheet names: {xl.sheet_names}")
    
    for sheet in xl.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet)
        print(f"\n--- Sheet: {sheet} ---")
        print(f"Columns: {df.columns.tolist()}")
        print("First 3 rows:")
        print(df.head(3))
        
except Exception as e:
    print(f"Error reading Excel file: {e}")
