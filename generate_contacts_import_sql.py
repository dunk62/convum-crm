import pandas as pd
import sys

input_file = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'
output_file = '/Users/hyeonhotak/Downloads/코딩/convum-crm/src/sql/import_contacts_from_excel.sql'
sheet_name = '고객DB'

def escape_sql(val):
    if pd.isna(val) or val == '':
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"

try:
    df = pd.read_excel(input_file, sheet_name=sheet_name)
    
    with open(output_file, 'w') as f:
        f.write("-- Import contacts from Excel\n")
        f.write("-- Maps '업체명' to account_id\n\n")
        
        for index, row in df.iterrows():
            company_name = row['업체명']
            contact_name = row['담당자명']
            
            # Skip if no company name or contact name
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
            
    print(f"Successfully generated SQL file at {output_file}")

except Exception as e:
    print(f"Error generating SQL: {e}")
