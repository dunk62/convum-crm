import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/11월 매출자료(편집용).xls'

try:
    # Try reading as Excel (xls)
    # Note: .xls files might need 'xlrd' engine, or if it's actually .xlsx renamed, 'openpyxl'
    # Let's try default first, then specific engines if needed.
    # Since it's .xls, xlrd is the standard engine, but pandas might auto-detect.
    # However, sometimes .xls files are actually HTML or XML.
    
    # First, list sheet names
    xls = pd.ExcelFile(file_path)
    print("Sheet names:", xls.sheet_names)
    
    # Read the first sheet to see columns
    df = pd.read_excel(file_path, sheet_name=0)
    print("\nColumns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head())
    
except Exception as e:
    print(f"Error reading file: {e}")
