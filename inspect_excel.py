import pandas as pd
import sys

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'

try:
    # Load the Excel file to list sheet names
    xls = pd.ExcelFile(file_path)
    print("Sheet names:", xls.sheet_names)

    # Try to find a sheet that looks like "Contacts" or "담당자"
    target_sheet = None
    for sheet in xls.sheet_names:
        if '담당자' in sheet or 'Contact' in sheet:
            target_sheet = sheet
            break
    
    if target_sheet:
        print(f"\nInspecting sheet: {target_sheet}")
        df = pd.read_excel(file_path, sheet_name=target_sheet, nrows=5)
        print("Columns:", df.columns.tolist())
        print("\nFirst 5 rows:")
        print(df.head())
    else:
        print("\nCould not find a sheet with '담당자' or 'Contact' in the name.")
        print("Please specify the sheet name.")

except Exception as e:
    print(f"Error reading Excel file: {e}")
