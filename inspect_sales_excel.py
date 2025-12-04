import os
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io

# Configuration
FILE_ID = '1uoJc5VoZffek8jCnh59bbj6VHA151-7b'
OUTPUT_FILE = 'sales_data.xlsx'

def get_drive_service():
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    if os.path.exists('service_account.json'):
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', scopes=SCOPES)
        return build('drive', 'v3', credentials=creds)
    return None

def download_file():
    service = get_drive_service()
    if not service:
        print("Service account not found.")
        return False

    try:
        request = service.files().get_media(fileId=FILE_ID)
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

def inspect_file():
    try:
        # Read all sheets
        xls = pd.ExcelFile(OUTPUT_FILE)
        print(f"Sheets: {xls.sheet_names}")
        
        # Inspect first sheet
        df = pd.read_excel(OUTPUT_FILE, sheet_name=0, header=None)
        print("\nFirst 20 rows of the first sheet:")
        print(df.head(20))
        
        # Search for "賣上明細"
        print("\nSearching for '賣上明細'...")
        for idx, row in df.iterrows():
            row_str = row.astype(str).values
            if any("受注明細" in s for s in row_str):
                print(f"Found '受注明細' at row {idx}")
                # Print header row (idx + 1)
                header_row = df.iloc[idx+1]
                print("\nHeader Row:")
                for i, val in enumerate(header_row):
                    print(f"Col {i}: {val}")
                
                # Print first data row
                print("\nFirst Data Row:")
                print(df.iloc[idx+2])
                break

    except Exception as e:
        print(f"Error inspecting file: {e}")

if __name__ == '__main__':
    if download_file():
        inspect_file()
