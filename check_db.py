import sqlite3

DB_FILE = 'processed_files.db'
FILE_ID = '1V4DmVJwp6eIqG8xDJKnCF4B0NxoNXrDt'

def check_db():
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("SELECT * FROM processed_files WHERE file_id = ?", (FILE_ID,))
        result = c.fetchone()
        conn.close()
        
        if result:
            print(f"✅ File {FILE_ID} IS in processed_files.db")
            print(f"Record: {result}")
        else:
            print(f"❌ File {FILE_ID} is NOT in processed_files.db")
            
        # Also count total files
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM processed_files")
        count = c.fetchone()[0]
        print(f"Total processed files: {count}")
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    check_db()
