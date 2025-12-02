import os
import time
import json
import sqlite3
import google.generativeai as genai
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from supabase import create_client, Client
from dotenv import load_dotenv
import io

# Load environment variables
load_dotenv()

# Configuration
DRIVE_FOLDER_ID = '1frhOoJUr6Z10YTdLDFdwq4Hnvkn8G2dO'
GEMINI_API_KEY = os.getenv('VITE_GEMINI_API_KEY')
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')
DB_FILE = 'processed_files.db'

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-flash-latest') # Using gemini-flash-latest as 1.5-flash alias was not found

# Initialize Local DB
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS processed_files
                 (file_id TEXT PRIMARY KEY, file_name TEXT, processed_at TIMESTAMP)''')
    conn.commit()
    conn.close()

def is_processed(file_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT 1 FROM processed_files WHERE file_id = ?", (file_id,))
    result = c.fetchone()
    conn.close()
    return result is not None

def mark_processed(file_id, file_name):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO processed_files (file_id, file_name, processed_at) VALUES (?, ?, datetime('now'))", (file_id, file_name))
    conn.commit()
    conn.close()

# Google Drive Service
def get_drive_service():
    # Assuming user has credentials.json or service_account.json
    # For simplicity, using service_account.json if available, else standard auth flow could be added
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    
    if os.path.exists('service_account.json'):
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', scopes=SCOPES)
    else:
        # Fallback to standard credentials.json (User might need to run quickstart flow once to generate token.json)
        # For this script, we'll assume service_account.json is the preferred server-side method
        print("Error: service_account.json not found.")
        return None

    return build('drive', 'v3', credentials=creds)

def download_file(service, file_id):
    request = service.files().get_media(fileId=file_id)
    file_content = io.BytesIO()
    downloader = MediaIoBaseDownload(file_content, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    return file_content

def analyze_audio(file_content, file_name):
    print(f"Analyzing {file_name} with Gemini...")
    
    temp_filename = f"temp_{file_name}"
    with open(temp_filename, "wb") as f:
        f.write(file_content.getbuffer())

    max_retries = 3
    retry_delay = 30

    for attempt in range(max_retries):
        try:
            # Upload to Gemini
            audio_file = genai.upload_file(path=temp_filename)
            
            prompt = """
            Analyze this sales call recording and extract the following information in JSON format.
            IMPORTANT: All values must be in Korean (한국어).

            {
                "summary": "3-line summary of the conversation (in Korean)",
                "sentiment_score": 0-100 (integer, higher is better),
                "customer_intent": "구매/거절/보류/정보수집 (Choose one in Korean)",
                "key_objections": ["가격", "기능", "일정", etc. (in Korean)],
                "action_items": ["견적서 송부", "기술 미팅 요청", etc. (in Korean)],
                "sales_coaching_tip": "One-line advice for the sales rep (in Korean)",
                "company_name": "Company name mentioned (or from filename)",
                "contact_name": "Contact person name (or from filename)",
                "keywords": ["Keyword1", "Keyword2", "Keyword3" (in Korean)]
            }
            
            Logic for Company/Contact Name:
            1. Prioritize filename if it contains [Company]Name format.
            2. Infer from conversation context.
            3. If unknown, use "미확인".
            """

            response = model.generate_content([prompt, audio_file])
            
            # Cleanup
            audio_file.delete()
            os.remove(temp_filename)

            # Parse JSON
            try:
                text = response.text.replace('```json', '').replace('```', '').strip()
                return json.loads(text)
            except json.JSONDecodeError:
                print("Failed to parse JSON response")
                print(response.text)
                return None
            except ValueError:
                print("Response validation failed")
                return None

        except Exception as e:
            if "429" in str(e) or "Quota exceeded" in str(e):
                print(f"Quota exceeded. Retrying in {retry_delay} seconds... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(retry_delay)
                retry_delay *= 2 # Exponential backoff
            else:
                print(f"Error analyzing audio: {e}")
                if os.path.exists(temp_filename):
                    os.remove(temp_filename)
                return None
    
    print("Max retries reached. Skipping file.")
    if os.path.exists(temp_filename):
        os.remove(temp_filename)
    return None

def main():
    init_db()
    service = get_drive_service()
    if not service:
        return

    print(f"Monitoring folder: {DRIVE_FOLDER_ID}")

    while True:
        try:
            # List files in folder
            results = service.files().list(
                q=f"'{DRIVE_FOLDER_ID}' in parents and trashed = false and (mimeType contains 'audio/')",
                fields="nextPageToken, files(id, name, webViewLink)").execute()
            items = results.get('files', [])

            if not items:
                print("No files found.")
            else:
                for item in items:
                    if not is_processed(item['id']):
                        print(f"New file detected: {item['name']}")
                        
                        # Download
                        file_content = download_file(service, item['id'])
                        
                        # Analyze
                        analysis = analyze_audio(file_content, item['name'])
                        
                        if analysis:
                            # Insert into Supabase
                            data = {
                                "type": "call",
                                "title": item['name'],
                                "content": analysis.get('summary', 'No summary'), # Storing summary in content as fallback or main text
                                "company_name": analysis.get('company_name'),
                                "contact_name": analysis.get('contact_name'),
                                "summary": analysis.get('summary'),
                                "sentiment_score": analysis.get('sentiment_score'),
                                "keywords": analysis.get('keywords'),
                                "next_action": analysis.get('action_items'),
                                "recording_link": item['webViewLink'],
                                "analysis_metadata": analysis
                            }
                            
                            supabase.table('data_records').insert(data).execute()
                            print(f"Saved analysis for {item['name']}")
                            
                            mark_processed(item['id'], item['name'])
                        else:
                            print(f"Skipping {item['name']} due to analysis failure")

            time.sleep(60) # Poll every minute

        except Exception as e:
            print(f"Error in polling loop: {e}")
            time.sleep(60)

if __name__ == '__main__':
    main()
