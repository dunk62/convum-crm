import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/11월 매출자료(편집용).xls'
try:
    df = pd.read_excel(file_path, header=None)
    print("Searching for 'KD TECH'...")
    for index, row in df.iterrows():
        # Check all columns for "KD TECH"
        found = False
        for i in range(len(row)):
            if str(row[i]).strip() == "KD TECH":
                found = True
                break
        
        if found:
            print(f"Row {index}:")
            for i in range(len(row)):
                print(f"  Col {i}: {row[i]}")
            break # Just print one example

except Exception as e:
    print(f"Error: {e}")
