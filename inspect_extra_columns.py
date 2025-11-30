import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'
sheet_name = '고객DB'

try:
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    # Columns of interest
    extra_cols = ['등급', '상태', '명함', '비고.1']
    
    print(f"Columns in sheet: {df.columns.tolist()}")
    
    for col in extra_cols:
        if col in df.columns:
            print(f"\n--- Column: {col} ---")
            print(df[col].head(10))
            print(f"Unique values (first 10): {df[col].unique()[:10]}")
        else:
            print(f"\nColumn '{col}' not found in DataFrame.")

except Exception as e:
    print(f"Error: {e}")
