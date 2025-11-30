import pandas as pd
import math

def clean_value(val):
    if pd.isna(val):
        return 'NULL'
    val_str = str(val).strip()
    # Escape single quotes
    val_str = val_str.replace("'", "''")
    return f"'{val_str}'"

try:
    df = pd.read_excel('컨범코리아_CRM구축_데이터베이스.xlsx')
    
    print("INSERT INTO accounts (id, name, industry, type, owner, phone, email, status, registration_date, main_phone, website, address, department, position, contact_name, grade, note)")
    print("VALUES")
    
    values_list = []
    for index, row in df.iterrows():
        id_val = clean_value(row['No'])
        name = clean_value(row['업체명'])
        industry = clean_value(row['업종'])
        # Map 거래상태 to type
        type_val = clean_value(row['거래상태'])
        owner = clean_value(row['담당영업'])
        phone = clean_value(row['휴대전화'])
        email = clean_value(row['이메일'])
        # Default status to 'Active'
        status = "'Active'"
        
        # Handle date format if needed, assuming string for now or standard date
        reg_date = clean_value(row['등록일'])
        if reg_date != 'NULL':
             # If it's a timestamp, take YYYY-MM-DD
             if isinstance(row['등록일'], pd.Timestamp):
                 reg_date = f"'{row['등록일'].strftime('%Y-%m-%d')}'"
        
        main_phone = clean_value(row['대표전화'])
        website = clean_value(row['홈페이지'])
        address = clean_value(row['주소'])
        department = clean_value(row['부서'])
        position = clean_value(row['직급'])
        contact_name = clean_value(row['담당자명'])
        grade = clean_value(row['등급'])
        
        # Append 유입경로 to note if present
        note_val = row['비고']
        source_val = row['유입경로']
        
        final_note = ""
        if not pd.isna(note_val):
            final_note += str(note_val)
        if not pd.isna(source_val):
            if final_note:
                final_note += f" (유입경로: {source_val})"
            else:
                final_note = f"유입경로: {source_val}"
        
        note = clean_value(final_note) if final_note else 'NULL'

        values_list.append(f"  ({id_val}, {name}, {industry}, {type_val}, {owner}, {phone}, {email}, {status}, {reg_date}, {main_phone}, {website}, {address}, {department}, {position}, {contact_name}, {grade}, {note})")

    print(",\n".join(values_list) + ";")

except Exception as e:
    print(f"Error: {e}")
