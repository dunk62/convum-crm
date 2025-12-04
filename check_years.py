import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

response = supabase.table('sales_performance').select('shipment_date').execute()
data = response.data

years = {}
for item in data:
    year = item['shipment_date'][:4]
    years[year] = years.get(year, 0) + 1

print("Available Years:", years)
