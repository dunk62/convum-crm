import os
import time
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
import import_sales_excel

# Configuration
DRIVE_FOLDER_ID = '1JW3xIvQqrSUxkE5bovPyvLcXVqmP0QIQ'
PROCESSED_FILES_LOG = 'processed_excel_files.json'
CHECK_INTERVAL = 60  # seconds

def get_drive_service():
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    if os.path.exists('service_account.json'):
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', scopes=SCOPES)
        return build('drive', 'v3', credentials=creds)
    return None

def load_processed_files():
    if os.path.exists(PROCESSED_FILES_LOG):
        try:
            with open(PROCESSED_FILES_LOG, 'r') as f:
                return set(json.load(f))
        except:
            return set()
    return set()

def save_processed_files(processed_files):
    with open(PROCESSED_FILES_LOG, 'w') as f:
        json.dump(list(processed_files), f)

def monitor_folder():
    print(f"Starting Excel pipeline monitoring for folder: {DRIVE_FOLDER_ID}")
    service = get_drive_service()
    if not service:
        print("Failed to initialize Drive service.")
        return

    processed_files = load_processed_files()
    print(f"Loaded {len(processed_files)} processed files.")

    while True:
        try:
            # Query for Excel files AND Google Sheets in the folder
            results = service.files().list(
                q=f"'{DRIVE_FOLDER_ID}' in parents and trashed = false and (mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType = 'application/vnd.ms-excel' or mimeType = 'application/vnd.google-apps.spreadsheet')",
                fields="files(id, name, createdTime, mimeType)",
                orderBy='createdTime desc',
                pageSize=20
            ).execute()
            
            files = results.get('files', [])
            
            new_files_found = False
            for file in files:
                file_id = file['id']
                file_name = file['name']
                mime_type = file.get('mimeType', '')
                
                if file_id not in processed_files:
                    print(f"New file found: {file_name} ({file_id}) - {mime_type}")
                    
                    # Process the file (pass mimeType for Google Sheets export)
                    print(f"Importing {file_name}...")
                    import_sales_excel.import_file(file_id, file_name + '.xlsx', mime_type)
                    
                    # Mark as processed
                    processed_files.add(file_id)
                    save_processed_files(processed_files)
                    new_files_found = True
                    print(f"Successfully processed {file_name}")
            
            if not new_files_found:
                print(".", end="", flush=True)
            else:
                print("") # Newline after processing

        except Exception as e:
            print(f"\nError in monitoring loop: {e}")

        time.sleep(CHECK_INTERVAL)

if __name__ == '__main__':
    monitor_folder()
