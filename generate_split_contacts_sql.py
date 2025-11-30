import pandas as pd
import math
import os

input_file = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'
output_dir = '/Users/hyeonhotak/Downloads/코딩/convum-crm/src/sql'
sheet_name = '고객DB'
num_parts = 14

def escape_sql(val):
    if pd.isna(val) or val == '':
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"

try:
    df = pd.read_excel(input_file, sheet_name=sheet_name)
    total_rows = len(df)
    chunk_size = math.ceil(total_rows / num_parts)
    
    print(f"Total rows: {total_rows}, Chunk size: {chunk_size}")

    for i in range(num_parts):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, total_rows)
        
        if start_idx >= total_rows:
            # Create empty file if no more data
            chunk_df = pd.DataFrame()
        else:
            chunk_df = df.iloc[start_idx:end_idx]
            
        filename = f'import_sales_performance_part{i+1}.sql'
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w') as f:
            f.write(f"-- Part {i+1} of Contact Import (mapped to sales_performance filenames)\n")
            
            if i == 0:
                 f.write("-- Optional: TRUNCATE TABLE contacts;\n\n")

            for index, row in chunk_df.iterrows():
                company_name = row['업체명']
                contact_name = row['담당자명']
                
                if pd.isna(company_name) or pd.isna(contact_name):
                    continue
                    
                position = escape_sql(row.get('직급'))
                department = escape_sql(row.get('부서'))
                phone = escape_sql(row.get('휴대전화'))
                email = escape_sql(row.get('이메일'))
                memo = escape_sql(row.get('비고'))
                contact_name_sql = escape_sql(contact_name)
                company_name_sql = escape_sql(company_name)
                
                sql = f"""
INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, {contact_name_sql}, {position}, {department}, {phone}, {email}, {memo}
FROM accounts
WHERE name = {company_name_sql};
"""
                f.write(sql)
        
        print(f"Generated {filename} with {len(chunk_df)} rows.")

except Exception as e:
    print(f"Error generating SQL: {e}")
