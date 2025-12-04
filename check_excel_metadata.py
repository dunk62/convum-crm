import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

FILE_ID = '1uoJc5VoZffek8jCnh59bbj6VHA151-7b'

def check_metadata():
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    if os.path.exists('service_account.json'):
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', scopes=SCOPES)
        service = build('drive', 'v3', credentials=creds)
        
        try:
            file = service.files().get(fileId=FILE_ID, fields="id, name, mimeType").execute()
            print(f"File Metadata: {file}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == '__main__':
    check_metadata()
