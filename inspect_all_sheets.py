import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'

try:
    xls = pd.ExcelFile(file_path)
    print("Sheet names:", xls.sheet_names)
    
    for sheet in xls.sheet_names:
        print(f"\n--- Sheet: {sheet} ---")
        try:
            df = pd.read_excel(file_path, sheet_name=sheet, nrows=5)
            print("Columns:", df.columns.tolist())
            print("First row values:", df.iloc[0].tolist() if not df.empty else "Empty")
        except Exception as e:
            print(f"Error reading sheet: {e}")

except Exception as e:
    print(f"Error opening file: {e}")
