import pandas as pd

file_path = '컨범코리아_CRM구축_데이터베이스.xlsx'

try:
    xl = pd.ExcelFile(file_path)
    print("Sheet names:", xl.sheet_names)
    
    if '담당자명 정보' in xl.sheet_names:
        df = pd.read_excel(file_path, sheet_name='담당자명 정보')
        print("\nColumns in '담당자명 정보':")
        print(df.columns.tolist())
        print("\nFirst 3 rows:")
        print(df.head(3))
    else:
        print("\n'담당자명 정보' sheet not found.")

except Exception as e:
    print(f"Error: {e}")
