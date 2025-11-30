import pandas as pd
import os

def clean_value(val):
    if pd.isna(val):
        return None
    return str(val).strip()

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def generate_sql():
    file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/판매 실적.xlsx'
    output_path = 'src/sql/import_sales_performance.sql'
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    try:
        df = pd.read_excel(file_path)
        
        sql_statements = []
        sql_statements.append("TRUNCATE TABLE sales_performance;")
        
        for _, row in df.iterrows():
            shipment_date = row.get('출고일')
            if pd.notna(shipment_date):
                shipment_date = f"'{shipment_date}'"
            else:
                shipment_date = "NULL"

            distributor_name = escape_sql(clean_value(row.get('판매점명')))
            company_name = escape_sql(clean_value(row.get('업체명')))
            sales_rep = escape_sql(clean_value(row.get('영업담당자')))
            product_name = escape_sql(clean_value(row.get('판매상품')))
            model_number = escape_sql(clean_value(row.get('형번')))
            
            quantity = row.get('수량', 0)
            if pd.isna(quantity): quantity = 0
            
            unit_price = row.get('단가', 0)
            if pd.isna(unit_price): unit_price = 0
            
            sales_amount = row.get('판매금액', 0)
            if pd.isna(sales_amount): sales_amount = 0

            sql = f"""INSERT INTO sales_performance (shipment_date, distributor_name, company_name, sales_rep, product_name, model_number, quantity, unit_price, sales_amount) VALUES ({shipment_date}, {distributor_name}, {company_name}, {sales_rep}, {product_name}, {model_number}, {quantity}, {unit_price}, {sales_amount});"""
            sql_statements.append(sql)
        
        chunk_size = 1000
        total_records = len(sql_statements) - 1 # Exclude truncate
        
        # Write chunks
        for i in range(0, total_records, chunk_size):
            chunk_statements = sql_statements[1+i : 1+i+chunk_size] # Skip truncate for chunks (except maybe first?)
            
            # Add truncate only to the first file
            if i == 0:
                chunk_statements.insert(0, "TRUNCATE TABLE sales_performance;")
            
            part_num = (i // chunk_size) + 1
            output_file = f'src/sql/import_sales_performance_part{part_num}.sql'
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(chunk_statements))
            print(f"Generated {output_file} with {len(chunk_statements)} statements")
            
        print(f"Successfully generated split SQL files.")
        
    except Exception as e:
        print(f"Error generating SQL: {e}")

if __name__ == "__main__":
    generate_sql()
