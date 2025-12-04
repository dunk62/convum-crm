import os
import time
import smtplib
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.zioyou.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '465'))
SMTP_USER = os.getenv('SMTP_USER', 'thh0222@convum.co.kr')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')

PDF_URL = "https://drive.google.com/uc?export=download&id=1HmuOMiOkf5waY7IXVCQSaq_ANSoZIm3W"
PDF_FILENAME = "Company_Introduction.pdf"

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def download_pdf():
    print("Downloading PDF...")
    response = requests.get(PDF_URL)
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"Failed to download PDF: {response.status_code}")

def send_email(to_email, company_name, manager_name, pdf_content):
    msg = MIMEMultipart()
    msg['Subject'] = f"{company_name} 귀중 - 진공 흡착 이송 솔루션 제안 (컨범코리아)"
    msg['From'] = SMTP_USER
    msg['To'] = to_email
    msg['Cc'] = "koreasales@convum.co.kr"

    body = f"""수신 : {company_name} / {manager_name} 님
참조 : 참조인 제위
발신 : 컨범 코리아 / 탁현호 소장

안녕하십니까.
(주)컨범코리아 남부전략영업소 탁현호입니다.

귀사의 홈페이지를 통해 자동화 장비 및 관련 기술 분야에 대한 사업을 영위하고 계신 것을 확인하여,
해당 장비의 워크물 이송 공정에 대해 폐사의 진공 흡착 이송 솔루션을 제안드리고자 메일을 송부드립니다.

컨범코리아는 CONVUM Ltd.의 한국 법인으로, CONVUM Ltd.(일본)은 1951년 설립되어 진공 제품을 전문적으로 제조해온 제조사입니다.

폐사는 70년 이상 축적된 기술력을 바탕으로, 이젝터, 진공 흡착 패드, 압력 센서 등 진공 흡착 이송에 대한 다양한 제품과 솔루션을 제공하여
국내외 다양한 제조 산업군의 자동화에 최적화된 레퍼런스를 갖추고 있습니다.

귀사의 자동화 장비에 대해 폐사 제품과 솔루션을 제안드리고자 폐사 회사소개서를 송부드리오니 확인과 미팅 검토를 요청드립니다.

감사합니다.

컨범 코리아
남부전략영업소
탁현호 배상

**************************************************
CONVUM KOREA CO., LTD.
Southern Strategic Sales Office / 남부전략영업소 탁현호 (TAK HYEON HO) 소장
〒46721 부산광역시 강서구 유통단지1로 41 (대저2동) 부산티플렉스 128동 208호
FAX) 051-987-2352
H.P) 010-4981-8390
E-mail : thh0222@convum.co.kr
Home page : http://www.convum.co.kr
CONVUM은 CONVUM Ltd.의 브랜드명입니다.
**************************************************
"""
    msg.attach(MIMEText(body, 'plain'))

    # Attach PDF
    part = MIMEApplication(pdf_content, Name=PDF_FILENAME)
    part['Content-Disposition'] = f'attachment; filename="{PDF_FILENAME}"'
    msg.attach(part)

    # Send
    # Use SSL for port 465, otherwise start TLS
    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            recipients = [to_email, "koreasales@convum.co.kr"]
            server.sendmail(SMTP_USER, recipients, msg.as_string())
    else:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            recipients = [to_email, "koreasales@convum.co.kr"]
            server.sendmail(SMTP_USER, recipients, msg.as_string())

def process_queue():
    print("Starting email sender service...")
    
    # Cache PDF
    try:
        pdf_content = download_pdf()
        print("PDF downloaded successfully.")
    except Exception as e:
        print(f"Critical Error: {e}")
        return

    while True:
        try:
            # Fetch pending items
            response = supabase.from_('email_queue').select('*, contacts(*, accounts(name))').eq('status', 'pending').limit(1).execute()
            items = response.data

            if not items:
                time.sleep(5)
                continue

            item = items[0]
            contact = item['contacts']
            account = contact.get('accounts')
            company_name = account.get('name') if account else '업체명 미상'
            
            print(f"Processing email for {contact['name']} ({contact['email']})...")

            try:
                if not contact['email']:
                    raise Exception("No email address")

                send_email(
                    to_email=contact['email'],
                    company_name=company_name,
                    manager_name=contact['name'],
                    pdf_content=pdf_content
                )

                # Update status
                supabase.table('contacts').update({'intro_mail_status': '발송완료'}).eq('id', contact['id']).execute()
                supabase.table('email_queue').update({'status': 'sent'}).eq('id', item['id']).execute()
                print("Email sent successfully.")

            except Exception as e:
                print(f"Failed to send email: {e}")
                supabase.table('email_queue').update({'status': 'failed', 'error_message': str(e)}).eq('id', item['id']).execute()

            # Sleep to prevent spamming
            time.sleep(3)

        except Exception as e:
            print(f"Loop Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    if not SMTP_PASSWORD:
        print("Error: SMTP_PASSWORD is not set in .env")
    else:
        process_queue()
