import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import time
import re
import uuid

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials not found in .env file.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BASE_URL = "https://www.robotworld.or.kr/visitors"
LIST_URL = f"{BASE_URL}/list_of_exhibitors.php"

def get_soup(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        # The site might be EUC-KR or UTF-8. BeautifulSoup usually detects it, but let's be safe.
        response.encoding = response.apparent_encoding 
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def scrape_details(detail_url):
    soup = get_soup(detail_url)
    if not soup:
        return None

    data = {}
    
    # Map of th text to data key
    field_map = {
        '국문상호명': 'company_name_kr',
        '국문주소': 'address_kr',
        '전화번호': 'phone',
        '홈페이지': 'website',
        '이메일 주소': 'email', # Note: Check exact text on page
        '이메일': 'email',
        '회사소개(국문)': 'company_intro',
        '제품소개(국문)': 'product_intro'
    }

    # Iterate over all table rows
    for tr in soup.find_all('tr'):
        th = tr.find('th')
        td = tr.find('td')
        if th and td:
            header = th.get_text(strip=True)
            value = td.get_text(strip=True)
            
            # Check if header matches any of our keys
            for key, data_key in field_map.items():
                if key in header:
                    data[data_key] = value
                    break
    
    return data

def update_supabase(data):
    if not data.get('company_name_kr'):
        print("Skipping: No company name found")
        return

    company_name = data['company_name_kr']
    print(f"Processing: {company_name}")

    # 1. Upsert Account
    # Check if account exists first to avoid duplicate IDs if name matches
    res = supabase.table('accounts').select('id').eq('name', company_name).execute()
    
    if res.data:
        account_id = res.data[0]['id']
        # Update
        account_data = {
            'name': company_name,
            'address': data.get('address_kr'),
            'main_phone': data.get('phone'),
            'website': data.get('website'),
        }
        supabase.table('accounts').update(account_data).eq('id', account_id).execute()
        print(f"  Updated Account: {company_name}")
    else:
        # Insert
        account_id = str(uuid.uuid4())
        account_data = {
            'id': account_id,
            'name': company_name,
            'address': data.get('address_kr'),
            'main_phone': data.get('phone'),
            'website': data.get('website'),
        }
        res = supabase.table('accounts').insert(account_data).execute()
        print(f"  Created Account: {company_name}")

    # 2. Upsert Contact
    contact_person = data.get('contact_person', '담당자')
    contact_name = f"{company_name}&{contact_person}"

    memo = f"회사소개:\n{data.get('company_intro', '')}\n\n제품소개:\n{data.get('product_intro', '')}"

    contact_data = {
        'account_id': account_id,
        'name': contact_name,
        'email': data.get('email'),
        'memo': memo
    }

    # Check if contact exists
    if data.get('email'):
        res = supabase.table('contacts').select('id').eq('email', data['email']).execute()
    else:
        res = supabase.table('contacts').select('id').eq('account_id', account_id).eq('name', contact_name).execute()

    if res.data:
        contact_id = res.data[0]['id']
        supabase.table('contacts').update(contact_data).eq('id', contact_id).execute()
        print(f"  Updated Contact: {contact_name}")
    else:
        supabase.table('contacts').insert(contact_data).execute()
        print(f"  Created Contact: {contact_name}")

def main():
    offset = 0
    while True:
        print(f"Scraping list page offset={offset}...")
        url = f"{LIST_URL}?offset={offset}&"
        soup = get_soup(url)
        if not soup:
            break

        links = soup.find_all('a', href=re.compile(r'pop_list_of_exhibitors\.php\?idx='))
        
        if not links:
            print("No more exhibitor links found.")
            break

        print(f"Found {len(links)} exhibitors on this page.")
        
        for link in links:
            href = link['href']
            if not href.startswith('http'):
                if href.startswith('/'):
                    href = f"https://www.robotworld.or.kr{href}"
                else:
                    href = f"{BASE_URL}/{href}"
            
            print(f"  Scraping details from {href}...")
            details = scrape_details(href)
            if details:
                update_supabase(details)
            
            time.sleep(0.5)

        if len(links) < 10:
             print("Reached end of list.")
             break
             
        offset += 10
        time.sleep(1)

if __name__ == "__main__":
    main()
