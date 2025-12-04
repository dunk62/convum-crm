import os
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import date

# Load environment variables
load_dotenv()

url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Supabase credentials not found.")
    exit(1)

supabase: Client = create_client(url, key)

def update_accounts():
    print("Fetching all accounts...")
    # Fetch all accounts, ordered by created_at DESC to match UI
    response = supabase.table('accounts').select('*').order('created_at', desc=True).execute()
    accounts = response.data

    if not accounts:
        print("No accounts found.")
        return

    print(f"Total accounts fetched: {len(accounts)}")

    # Find indices
    start_name = "iR 수성"
    end_name = "가온로보틱스"

    start_index = -1
    end_index = -1

    for i, account in enumerate(accounts):
        if account['name'] == start_name:
            start_index = i
        if account['name'] == end_name:
            end_index = i
    
    if start_index == -1:
        print(f"Error: Start account '{start_name}' not found.")
        return
    if end_index == -1:
        print(f"Error: End account '{end_name}' not found.")
        return

    # Ensure start comes before end (or swap if needed, though user said 1 to 240)
    # In DESC order, 1 is start, 240 is end. So start_index < end_index.
    if start_index > end_index:
        print(f"Warning: Start index ({start_index}) is greater than end index ({end_index}). Swapping.")
        start_index, end_index = end_index, start_index

    target_accounts = accounts[start_index : end_index + 1]
    print(f"Found {len(target_accounts)} accounts to update (Index {start_index} to {end_index}).")
    print(f"First: {target_accounts[0]['name']}")
    print(f"Last: {target_accounts[-1]['name']}")

    # Prepare update data
    today_str = date.today().isoformat()
    update_payload = {
        'industry': '로봇',
        'registration_date': today_str
    }

    print("Updating accounts...")
    
    # Update in batches or one by one? 
    # Supabase 'in' filter can handle multiple IDs.
    target_ids = [acc['id'] for acc in target_accounts]
    
    # Split into chunks of 50 to avoid URL length limits if any
    chunk_size = 50
    for i in range(0, len(target_ids), chunk_size):
        chunk = target_ids[i : i + chunk_size]
        try:
            response = supabase.table('accounts').update(update_payload).in_('id', chunk).execute()
            print(f"Updated batch {i//chunk_size + 1}: {len(response.data)} accounts.")
        except Exception as e:
            print(f"Error updating batch {i//chunk_size + 1}: {e}")

    print("Update complete.")

if __name__ == "__main__":
    update_accounts()
