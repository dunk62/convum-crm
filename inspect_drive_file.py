import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
FILE_ID = '1V4DmVJwp6eIqG8xDJKnCF4B0NxoNXrDt'
DRIVE_FOLDER_ID = '1frhOoJUr6Z10YTdLDFdwq4Hnvkn8G2dO'

def get_drive_service():
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    if os.path.exists('service_account.json'):
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', scopes=SCOPES)
        return build('drive', 'v3', credentials=creds)
    return None

def main():
    service = get_drive_service()
    if not service:
        print("Service account not found.")
        return

    try:
        file = service.files().get(fileId=FILE_ID, fields="id, name, mimeType, parents, trashed").execute()
        print(f"File Details:")
        print(f"ID: {file.get('id')}")
        print(f"Name: {file.get('name')}")
        print(f"MimeType: {file.get('mimeType')}")
        print(f"Parents: {file.get('parents')}")
        print(f"Trashed: {file.get('trashed')}")
        
        if DRIVE_FOLDER_ID in file.get('parents', []):
            print(f"✅ File is in the correct folder ({DRIVE_FOLDER_ID})")
        else:
            print(f"❌ File is NOT in the correct folder. Expected {DRIVE_FOLDER_ID}, found {file.get('parents')}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
