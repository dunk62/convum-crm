import os
import pandas as pd
import re
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Drive Configuration
FILE_ID = '1uoJc5VoZffek8jCnh59bbj6VHA151-7b'
OUTPUT_FILE = 'sales_data.xlsx'

def get_drive_service():
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    if os.path.exists('service_account.json'):
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', scopes=SCOPES)
        return build('drive', 'v3', credentials=creds)
    return None

def download_file(file_id=None, mime_type=None):
    service = get_drive_service()
    if not service:
        print("Service account not found.")
        return False

    target_file_id = file_id if file_id else FILE_ID
    
    try:
        # Google Sheets need to be exported as Excel
        if mime_type == 'application/vnd.google-apps.spreadsheet':
            print(f"Exporting Google Sheets as Excel...")
            request = service.files().export_media(
                fileId=target_file_id,
                mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        else:
            # Regular file download
            request = service.files().get_media(fileId=target_file_id)
        
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}%.")
        
        with open(OUTPUT_FILE, 'wb') as f:
            f.write(fh.getbuffer())
        print(f"Downloaded to {OUTPUT_FILE}")
        return True
    except Exception as e:
        print(f"Error downloading file: {e}")
        return False

def parse_date_from_sheet_name(sheet_name):
    # Format: 2025.12.3(WED) -> 2025-12-03
    try:
        date_part = sheet_name.split('(')[0]
        return pd.to_datetime(date_part, format='%Y.%m.%d').strftime('%Y-%m-%d')
    except Exception as e:
        print(f"Error parsing date from {sheet_name}: {e}")
        return None

def process_sales_data(df, sheet_date):
    records = []
    
    # Find "賣上明細" row
    start_row = -1
    for idx, row in df.iterrows():
        row_str = row.astype(str).values
        if any("賣上明細" in s for s in row_str):
            start_row = idx
            break
            
    if start_row == -1:
        return []

    # Data starts 2 rows after "賣上明細" (Header is +1, Data is +2)
    data_start_row = start_row + 2
    
    current_distributor = None

    # Iterate through data rows
    for idx in range(data_start_row, len(df)):
        row = df.iloc[idx]
        
        raw_distributor = str(row[0]).strip()
        user_name = str(row[1]).strip()
        row_str = row.astype(str).values
        
        # Stop if we hit the other table's header
        if any("受注明細" in s for s in row_str):
            break

        # Check for end of table markers in Distributor column
        if "Total" in raw_distributor or "TOTAL" in raw_distributor:
            break

        # Handle Distributor Name (Forward Fill)
        if pd.notna(row[0]) and raw_distributor != 'nan' and raw_distributor != '':
            if "小計" in raw_distributor: # Skip subtotal lines if marked in distributor col
                continue
            current_distributor = raw_distributor
        
        # If we don't have a distributor yet, skip
        if not current_distributor:
            continue
            
        # Check for Subtotal/Total in User column or empty User column
        if pd.isna(row[1]) or user_name == 'nan' or user_name == '':
            continue
            
        if "小計" in user_name or "Total" in user_name:
            continue

        # Extract fields
        try:
            # Skip if product name is empty
            if pd.isna(row[5]) or str(row[5]).strip() == 'nan':
                 continue

            record = {
                'shipment_date': sheet_date,
                'distributor_name': current_distributor,
                'company_name': user_name,
                'sales_rep': str(row[3]).strip(),    # 営業担当者
                'product_name': str(row[5]).strip(), # BRAND COLOR
                'model_number': str(row[7]).strip(), # MODEL
                'quantity': int(row[8]) if pd.notna(row[8]) else 0, # Q'TY
                'unit_price': int(row[9]) if pd.notna(row[9]) else 0, # UNIT(KRW)
                'sales_amount': int(row[10]) if pd.notna(row[10]) else 0 # AMOUNT(KRW)
            }
            records.append(record)
        except Exception as e:
            print(f"Error parsing sales row {idx}: {e}")
            continue
            
    return records

def process_order_data(df, sheet_date):
    records = []
    
    # Find "受注明細" row
    start_row = -1
    for idx, row in df.iterrows():
        row_str = row.astype(str).values
        if any("受注明細" in s for s in row_str):
            start_row = idx
            break
            
    if start_row == -1:
        return []

    # Data starts 2 rows after "受注明細"
    data_start_row = start_row + 2
    
    current_distributor = None

    # Iterate through data rows
    for idx in range(data_start_row, len(df)):
        row = df.iloc[idx]
        
        raw_distributor = str(row[0]).strip()
        user_name = str(row[1]).strip()
        row_str = row.astype(str).values

        # Stop if we hit the other table's header (unlikely if Order is last, but good safety)
        if any("賣上明細" in s for s in row_str):
            break
        
        # Check for end of table markers
        if "Total" in raw_distributor or "TOTAL" in raw_distributor:
            break

        # Handle Distributor Name (Forward Fill)
        if pd.notna(row[0]) and raw_distributor != 'nan' and raw_distributor != '':
            if "小計" in raw_distributor:
                continue
            current_distributor = raw_distributor
        
        if not current_distributor:
            continue
            
        if pd.isna(row[1]) or user_name == 'nan' or user_name == '':
            continue
            
        if "小計" in user_name or "Total" in user_name:
            continue

        # Extract fields for Order Performance
        # Col 0: Distributor, Col 1: User, Col 3: Sales Rep, Col 5: Brand/Product, Col 7: Model
        # Col 9: Qty, Col 11: Unit Price, Col 12: Amount
        try:
            if pd.isna(row[5]) or str(row[5]).strip() == 'nan':
                 continue

            record = {
                'order_date': sheet_date,
                'distributor_name': current_distributor,
                'company_name': user_name,
                'sales_rep': str(row[3]).strip(),
                'product_name': str(row[5]).strip(),
                'model_number': str(row[7]).strip(),
                'quantity': int(row[9]) if pd.notna(row[9]) else 0,
                'unit_price': int(row[11]) if pd.notna(row[11]) else 0,
                'total_amount': int(row[12]) if pd.notna(row[12]) else 0
            }
            records.append(record)
        except Exception as e:
            print(f"Error parsing order row {idx}: {e}")
            continue
            
    return records

def import_file(file_id, file_name='downloaded_sales_data.xlsx', mime_type=None):
    global FILE_ID, OUTPUT_FILE
    FILE_ID = file_id
    OUTPUT_FILE = file_name
    
    if not download_file(file_id, mime_type):
        return

    try:
        xls = pd.ExcelFile(OUTPUT_FILE)
        all_sales_records = []
        all_order_records = []
        processed_dates = set()

        for sheet_name in xls.sheet_names:
            print(f"Processing sheet: {sheet_name}")
            sheet_date = parse_date_from_sheet_name(sheet_name)
            
            if not sheet_date:
                print(f"Skipping sheet {sheet_name} (invalid date format)")
                continue
                
            processed_dates.add(sheet_date)
            
            df = pd.read_excel(OUTPUT_FILE, sheet_name=sheet_name, header=None)
            
            # Process Sales Data
            sales_records = process_sales_data(df, sheet_date)
            all_sales_records.extend(sales_records)
            print(f"Found {len(sales_records)} sales records in {sheet_name}")
            
            # Process Order Data
            order_records = process_order_data(df, sheet_date)
            all_order_records.extend(order_records)
            print(f"Found {len(order_records)} order records in {sheet_name}")

        # Normalize product names (RED, BLUE, NO LOGO -> 올바른 상품군)
        INVALID_PRODUCT_NAMES = ['RED', 'BLUE', 'NO LOGO']
        
        def normalize_product_names(records):
            if not records:
                return records
            
            # 1. 영구 매핑 테이블에서 형번-상품군 매핑 조회
            print("Fetching model-product mapping from model_product_mapping table...")
            model_to_product = {}
            page = 0
            page_size = 1000
            
            while True:
                response = supabase.table('model_product_mapping')\
                    .select('model_number, product_name')\
                    .range(page * page_size, (page + 1) * page_size - 1)\
                    .execute()
                
                if not response.data:
                    break
                    
                for row in response.data:
                    pn = (row.get('product_name') or '').strip()
                    mn = (row.get('model_number') or '').strip()
                    if mn and pn:
                        model_to_product[mn] = pn
                        
                if len(response.data) < page_size:
                    break
                page += 1
            
            print(f"Loaded {len(model_to_product)} model-product mappings")
            
            # 2. 새로운 유효 매핑 수집 (import 데이터에서 유효한 상품군 발견 시)
            new_mappings = []
            for record in records:
                pn = (record.get('product_name') or '').strip()
                mn = (record.get('model_number') or '').strip()
                
                if mn and pn and pn.upper() not in INVALID_PRODUCT_NAMES:
                    if mn not in model_to_product:
                        model_to_product[mn] = pn
                        new_mappings.append({'model_number': mn, 'product_name': pn})
            
            # 3. 새 매핑을 테이블에 저장
            if new_mappings:
                print(f"Saving {len(new_mappings)} new mappings to model_product_mapping table...")
                try:
                    supabase.table('model_product_mapping').upsert(
                        new_mappings, 
                        on_conflict='model_number'
                    ).execute()
                except Exception as e:
                    print(f"Warning: Could not save new mappings: {e}")
            
            # 4. 잘못된 상품군 정규화
            normalized_count = 0
            for record in records:
                pn = (record.get('product_name') or '').strip()
                mn = (record.get('model_number') or '').strip()
                
                if pn.upper() in INVALID_PRODUCT_NAMES and mn:
                    valid_pn = model_to_product.get(mn)
                    if valid_pn:
                        record['product_name'] = valid_pn
                        normalized_count += 1
            
            print(f"Normalized {normalized_count} product names")
            return records
        
        # Apply normalization
        if all_sales_records:
            all_sales_records = normalize_product_names(all_sales_records)
        if all_order_records:
            all_order_records = normalize_product_names(all_order_records)

        # Import Sales Data
        if all_sales_records:
            print("Deleting existing sales records for processed dates...")
            for date in processed_dates:
                supabase.table('sales_performance').delete().eq('shipment_date', date).execute()

            print(f"Inserting {len(all_sales_records)} sales records...")
            batch_size = 100
            for i in range(0, len(all_sales_records), batch_size):
                batch = all_sales_records[i:i+batch_size]
                supabase.table('sales_performance').insert(batch).execute()
        
        # Import Order Data
        if all_order_records:
            print("Deleting existing order records for processed dates...")
            for date in processed_dates:
                supabase.table('order_performance').delete().eq('order_date', date).execute()

            print(f"Inserting {len(all_order_records)} order records...")
            for i in range(0, len(all_order_records), batch_size):
                batch = all_order_records[i:i+batch_size]
                supabase.table('order_performance').insert(batch).execute()

        print("Import completed successfully!")

    except Exception as e:
        print(f"Error importing data: {e}")

if __name__ == '__main__':
    # Default file ID for testing
    import_file('1uoJc5VoZffek8jCnh59bbj6VHA151-7b')
