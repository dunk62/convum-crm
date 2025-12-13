#!/usr/bin/env python3
"""
sync_recordings.py - Google Drive 녹음 파일 → CRM data_records 자동 동기화

사용법:
    python3 sync_recordings.py

필수 환경변수 (.env):
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
    - GOOGLE_DRIVE_FOLDER_ID (녹음 파일 폴더 ID)

Google API 인증:
    - Google Cloud Console에서 Service Account 생성
    - JSON 키 파일 다운로드
    - 환경변수 GOOGLE_APPLICATION_CREDENTIALS에 경로 설정
    - 또는 google_credentials.json 파일로 저장
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import required libraries
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from supabase import create_client
except ImportError as e:
    print(f"필요한 라이브러리가 없습니다. 다음 명령어로 설치하세요:")
    print("pip install google-auth google-auth-oauthlib google-api-python-client supabase python-dotenv")
    exit(1)

# Configuration
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')
FOLDER_ID = os.getenv('GOOGLE_DRIVE_FOLDER_ID', '1U2vvj-63SdwMmRze34LOy8V4-dmolldy')

# Google Drive API scopes
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']


def get_google_credentials():
    """Google API 인증 정보 로드"""
    # 1. 환경변수에서 JSON 키 파일 경로 확인
    creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if creds_path and os.path.exists(creds_path):
        return service_account.Credentials.from_service_account_file(creds_path, scopes=SCOPES)
    
    # 2. 현재 디렉토리의 google_credentials.json 확인
    local_creds = 'google_credentials.json'
    if os.path.exists(local_creds):
        return service_account.Credentials.from_service_account_file(local_creds, scopes=SCOPES)
    
    # 3. 환경변수에서 직접 JSON 문자열 확인
    creds_json = os.getenv('GOOGLE_CREDENTIALS_JSON')
    if creds_json:
        creds_info = json.loads(creds_json)
        return service_account.Credentials.from_service_account_info(creds_info, scopes=SCOPES)
    
    raise FileNotFoundError(
        "Google API 인증 정보를 찾을 수 없습니다.\n"
        "다음 중 하나를 설정하세요:\n"
        "1. GOOGLE_APPLICATION_CREDENTIALS 환경변수에 JSON 키 파일 경로 설정\n"
        "2. google_credentials.json 파일을 현재 디렉토리에 저장\n"
        "3. GOOGLE_CREDENTIALS_JSON 환경변수에 JSON 문자열 저장"
    )


def list_drive_files(service, folder_id):
    """Google Drive 폴더 내 파일 목록 조회"""
    results = service.files().list(
        q=f"'{folder_id}' in parents and trashed=false",
        fields="files(id, name, mimeType, createdTime, webViewLink)",
        orderBy="createdTime desc",
        pageSize=100
    ).execute()
    
    return results.get('files', [])


def get_existing_recordings(supabase):
    """이미 등록된 녹음 파일 링크 목록 조회"""
    result = supabase.table('data_records').select('recording_link').execute()
    return set(item['recording_link'] for item in result.data if item.get('recording_link'))


def parse_filename(filename):
    """파일명에서 정보 추출 (예: 2024-12-13_홍길동_010-1234-5678.m4a)"""
    # 확장자 제거
    name_without_ext = os.path.splitext(filename)[0]
    
    # 기본값
    title = filename
    contact_name = None
    
    # 파일명 파싱 시도 (다양한 형식 지원)
    parts = name_without_ext.replace('_', ' ').replace('-', ' ').split()
    
    # 전화번호 패턴 찾기
    phone_pattern = None
    for part in parts:
        if part.replace(' ', '').replace('-', '').isdigit() and len(part) >= 10:
            phone_pattern = part
            break
    
    return {
        'title': f"통화 녹음 - {filename}",
        'contact_name': contact_name,
        'phone': phone_pattern
    }


def sync_recordings():
    """메인 동기화 함수"""
    print("=" * 50)
    print("🔄 Google Drive 녹음 파일 동기화 시작")
    print("=" * 50)
    
    # Supabase 클라이언트 초기화
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Supabase 환경변수가 설정되지 않았습니다.")
        return
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"✅ Supabase 연결 완료")
    
    # Google Drive API 초기화
    try:
        credentials = get_google_credentials()
        service = build('drive', 'v3', credentials=credentials)
        print(f"✅ Google Drive API 연결 완료")
    except Exception as e:
        print(f"❌ Google API 인증 실패: {e}")
        return
    
    # 폴더 내 파일 조회
    print(f"\n📁 폴더 ID: {FOLDER_ID}")
    files = list_drive_files(service, FOLDER_ID)
    print(f"📄 발견된 파일: {len(files)}개")
    
    if not files:
        print("ℹ️ 폴더에 파일이 없습니다.")
        return
    
    # 이미 등록된 파일 확인
    existing_links = get_existing_recordings(supabase)
    print(f"📊 이미 등록된 녹음: {len(existing_links)}개")
    
    # 새 파일 등록
    new_count = 0
    for file in files:
        file_link = file.get('webViewLink', f"https://drive.google.com/file/d/{file['id']}/view")
        
        # 이미 등록된 파일 스킵
        if file_link in existing_links:
            continue
        
        # 오디오 파일만 처리
        mime_type = file.get('mimeType', '')
        if not mime_type.startswith('audio/') and not file['name'].endswith(('.m4a', '.mp3', '.amr', '.wav', '.ogg')):
            continue
        
        # 파일 정보 파싱
        parsed = parse_filename(file['name'])
        
        # data_records에 등록
        record = {
            'type': 'call',
            'title': parsed['title'],
            'content': f"통화 녹음 파일입니다.\n\n파일명: {file['name']}\n생성일: {file.get('createdTime', 'N/A')}",
            'contact_name': parsed.get('contact_name'),
            'recording_link': file_link,
            'keywords': ['통화녹음', '자동등록'],
        }
        
        try:
            supabase.table('data_records').insert(record).execute()
            print(f"  ✅ 등록: {file['name']}")
            new_count += 1
        except Exception as e:
            print(f"  ❌ 등록 실패: {file['name']} - {e}")
    
    print("\n" + "=" * 50)
    print(f"🎉 동기화 완료! 새로 등록된 파일: {new_count}개")
    print("=" * 50)


if __name__ == '__main__':
    sync_recordings()
