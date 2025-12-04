import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_data():
    try:
        print("Checking for records with missing shipment_date...")
        
        # Count records to be deleted
        # Note: 'is_' is used for checking NULL in Supabase-py (postgrest-py)
        # But sometimes .eq('shipment_date', None) or .is_('shipment_date', 'null') is used.
        # Let's try .is_('shipment_date', 'null')
        
        response = supabase.table('sales_performance').select('*', count='exact').is_('shipment_date', 'null').execute()
        count = response.count
        
        print(f"Found {count} records with missing shipment_date.")
        
        if count > 0:
            # Delete them
            delete_response = supabase.table('sales_performance').delete().is_('shipment_date', 'null').execute()
            print(f"Deleted {len(delete_response.data)} records.")
        else:
            print("No records to delete.")

    except Exception as e:
        print(f"Error cleaning data: {e}")

if __name__ == '__main__':
    clean_data()
