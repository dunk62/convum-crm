import pandas as pd
import os
from datetime import datetime

def clean_value(val):
    if pd.isna(val):
        return None
    return str(val).strip()

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def generate_sql():
    file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/11월 매출자료(편집용).xls'
    output_path = 'src/sql/import_nov_sales.sql'
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    try:
        # Read without header since the file seems to lack one
        df = pd.read_excel(file_path, header=None)
        
        sql_statements = []
        
        # Skip the first row if it contains column names (it looked like data in inspection, but let's check)
        # The inspection showed: 20251111.0 10000.0 ...
        # If the first row is data, we process it.
        
        for index, row in df.iterrows():
            # Map columns based on inspection
            # Col 0: Date (20251111)
            # Col 2: Company (CONVUM LTD)
            # Col 6: Sales Rep (윤회승(수출))
            # Col 10: Product Name (FA機器その他) - Guessing
            # Col 12: Model Number (CKV010-4E)
            # Col 15: Quantity (5000)
            # Col 16: Sales Amount (29475000)
            
            raw_date = row[0]
            shipment_date = "NULL"
            if pd.notna(raw_date):
                try:
                    # Convert 20251111 to 2025-11-11
                    date_str = str(int(raw_date))
                    dt = datetime.strptime(date_str, '%Y%m%d')
                    shipment_date = f"'{dt.strftime('%Y-%m-%d')}'"
                except:
                    pass

            distributor_name = escape_sql(clean_value(row[2]))
            company_name = escape_sql(clean_value(row[4])) # Col 4 is the actual company name
            sales_rep = escape_sql(clean_value(row[6]))
            product_name = escape_sql(clean_value(row[10])) # Assuming Col 10 is product category/name
            model_number = escape_sql(clean_value(row[12]))
            
            quantity = row[15]
            if pd.isna(quantity): quantity = 0
            
            sales_amount = row[16]
            if pd.isna(sales_amount): sales_amount = 0
            
            # Calculate unit price
            unit_price = 0
            if quantity > 0:
                unit_price = float(sales_amount) / float(quantity)
            
            record = {
                "shipment_date": shipment_date.strip("'") if shipment_date != "NULL" else None,
                "distributor_name": row[2] if pd.notna(row[2]) else None,
                "company_name": row[4] if pd.notna(row[4]) else None,
                "sales_rep": row[6] if pd.notna(row[6]) else None,
                "product_name": row[10] if pd.notna(row[10]) else None,
                "model_number": row[12] if pd.notna(row[12]) else None,
                "quantity": quantity,
                "unit_price": unit_price,
                "sales_amount": sales_amount
            }
            sql_statements.append(record)
        
        import json
        output_json_path = 'src/data/nov_sales.json'
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(sql_statements, f, ensure_ascii=False, indent=2)
            
        print(f"Generated {output_json_path} with {len(sql_statements)} records")
        
    except Exception as e:
        print(f"Error generating JSON: {e}")

if __name__ == "__main__":
    generate_sql()
