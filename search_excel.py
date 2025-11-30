import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'

keywords = ['출고', 'shipment', '품명', 'product', '판매', 'sales']

try:
    xls = pd.ExcelFile(file_path)
    found = False
    
    for sheet in xls.sheet_names:
        try:
            df = pd.read_excel(file_path, sheet_name=sheet, nrows=20)
            # Check columns
            for col in df.columns:
                if any(k in str(col).lower() for k in keywords):
                    print(f"Found keyword in sheet '{sheet}', column: {col}")
                    found = True
            
            # Check first few rows
            for index, row in df.iterrows():
                for val in row:
                    if any(k in str(val).lower() for k in keywords):
                        print(f"Found keyword in sheet '{sheet}', row {index}, value: {val}")
                        found = True
                        break
        except Exception as e:
            print(f"Error reading sheet {sheet}: {e}")
            
    if not found:
        print("No keywords found in any sheet.")

except Exception as e:
    print(f"Error opening file: {e}")
