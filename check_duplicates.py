import pandas as pd

file_path = '/Users/hyeonhotak/Downloads/코딩/convum-crm/컨범코리아_CRM구축_데이터베이스.xlsx'
sheet_name = '고객DB'

try:
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    # Check for duplicate company names
    dup_companies = df[df.duplicated(subset=['업체명'], keep=False)]
    
    if not dup_companies.empty:
        print(f"Found {len(dup_companies)} rows with duplicate company names.")
        print("Sample of duplicates:")
        print(dup_companies[['업체명', '담당자명', '직급', '휴대전화']].head(10))
        
        # Check if contact info differs for duplicates
        # Group by company and count unique contact names
        grouped = df.groupby('업체명')['담당자명'].nunique()
        multi_contact_companies = grouped[grouped > 1]
        
        if not multi_contact_companies.empty:
            print(f"\nFound {len(multi_contact_companies)} companies with multiple DIFFERENT contact names.")
            print(multi_contact_companies.head())
        else:
            print("\nDuplicate companies have the SAME (or single unique) contact name.")
    else:
        print("No duplicate company names found.")

except Exception as e:
    print(f"Error: {e}")
