import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
DRIVE_FOLDER_ID = '1frhOoJUr6Z10YTdLDFdwq4Hnvkn8G2dO'

def get_drive_service():
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    if os.path.exists('service_account.json'):
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', scopes=SCOPES)
        return build('drive', 'v3', credentials=creds)
    return None

def list_excel_files():
    service = get_drive_service()
    if not service:
        print("Service account not found.")
        return

    try:
        # Query for Excel files
        results = service.files().list(
            q=f"'{DRIVE_FOLDER_ID}' in parents and trashed = false and (mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType = 'application/vnd.ms-excel')",
            fields="files(id, name, createdTime)",
            orderBy='createdTime desc',
            pageSize=10
        ).execute()
        
        files = results.get('files', [])
        
        if not files:
            print("No Excel files found in the folder.")
        else:
            print("Found Excel files:")
            for file in files:
                print(f"Name: {file['name']}, ID: {file['id']}, Created: {file['createdTime']}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    list_excel_files()
