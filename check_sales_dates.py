import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Supabase credentials not found in environment variables.")
    exit(1)

supabase: Client = create_client(url, key)

try:
    # Get min and max shipment_date
    response = supabase.table("sales_performance").select("shipment_date").order("shipment_date", desc=False).limit(1).execute()
    min_date = response.data[0]['shipment_date'] if response.data else "No data"
    
    response = supabase.table("sales_performance").select("shipment_date").order("shipment_date", desc=True).limit(1).execute()
    max_date = response.data[0]['shipment_date'] if response.data else "No data"
    
    print(f"Min Date: {min_date}")
    print(f"Max Date: {max_date}")
    
    # Check date of 13000th record (ordered by shipment_date desc)
    response = supabase.table("sales_performance").select("shipment_date").order("shipment_date", desc=True).limit(20000).execute()
    count = len(response.data)
    print(f"Fetched count: {count}")
    if count > 0:
        last_date = response.data[-1]['shipment_date']
        print(f"Last record date: {last_date}")

except Exception as e:
    print(f"Error: {e}")
