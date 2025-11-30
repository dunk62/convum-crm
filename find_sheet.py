import pandas as pd
import glob
import os

target_sheet = '담당자명 정보'
files = glob.glob('*.xlsx')

found = False
for f in files:
    try:
        xl = pd.ExcelFile(f)
        if target_sheet in xl.sheet_names:
            print(f"FOUND '{target_sheet}' in file: {f}")
            df = pd.read_excel(f, sheet_name=target_sheet)
            print("Columns:", df.columns.tolist())
            print("First row:", df.iloc[0].to_dict())
            found = True
            break
        else:
            print(f"Not in {f}. Sheets: {xl.sheet_names}")
    except Exception as e:
        print(f"Error reading {f}: {e}")

if not found:
    print(f"Could not find sheet '{target_sheet}' in any .xlsx file.")
