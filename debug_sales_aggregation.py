import os
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime

load_dotenv()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Supabase credentials not found.")
    exit(1)

supabase = create_client(url, key)

def debug_aggregation():
    print("Fetching data (limit 20000)...")
    try:
        response = supabase.table('sales_performance').select('distributor_name, shipment_date, sales_amount').limit(20000).execute()
        sales_data = response.data
        print(f"Fetched {len(sales_data)} rows.")
        
        if not sales_data:
            print("No data found.")
            return

        # Mimic frontend logic
        all_years = [datetime.fromisoformat(d['shipment_date'].replace('Z', '+00:00')).year for d in sales_data]
        max_year = max(all_years)
        this_year = max_year
        last_year = max_year - 1
        
        print(f"Max Year: {max_year}")
        print(f"This Year: {this_year}")
        print(f"Last Year: {last_year}")

        aggregation = {}

        for record in sales_data:
            date = datetime.fromisoformat(record['shipment_date'].replace('Z', '+00:00'))
            year = date.year
            store = record['distributor_name'] or 'Unknown'

            if store not in aggregation:
                aggregation[store] = {'last_year': 0, 'this_year': 0}

            if year == last_year:
                aggregation[store]['last_year'] += record['sales_amount']
            elif year == this_year:
                aggregation[store]['this_year'] += record['sales_amount']

        # Print top 10 stores by this year sales
        sorted_stores = sorted(aggregation.items(), key=lambda x: x[1]['this_year'], reverse=True)[:10]
        
        print("\nTop 10 Stores Aggregation:")
        for store, sales in sorted_stores:
            print(f"Store: {store}, {last_year}: {sales['last_year']:,}, {this_year}: {sales['this_year']:,}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_aggregation()
