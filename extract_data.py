import pandas as pd
import json
import os

def clean_value(val):
    if pd.isna(val):
        return ""
    return str(val).strip()

def generate_ts_file():
    base_path = "."
    files = {
        "accounts": "컨범코리아_CRM구축_데이터베이스.xlsx",
        "opportunities": "컨범코리아_CRM구축_영업 기회.xlsx",
        "employees": "컨범코리아_CRM구축_직원 명단.xlsx"
    }
    
    ts_content = []
    
    # Process Accounts
    if os.path.exists(files["accounts"]):
        df = pd.read_excel(files["accounts"])
        accounts = []
        for _, row in df.iterrows():
            accounts.append({
                "id": clean_value(row.get("No")),
                "name": clean_value(row.get("업체명")),
                "industry": clean_value(row.get("업종")) or "기타",
                "type": clean_value(row.get("거래상태")),
                "owner": clean_value(row.get("담당영업")),
                "phone": clean_value(row.get("대표전화")) or clean_value(row.get("휴대전화")),
                "email": clean_value(row.get("이메일")),
                "status": "Active" if clean_value(row.get("등급")) in ["A", "B"] else "Inactive"
            })
        ts_content.append(f"export const accounts = {json.dumps(accounts, ensure_ascii=False, indent=2)};")

    # Process Opportunities
    if os.path.exists(files["opportunities"]):
        df = pd.read_excel(files["opportunities"])
        opportunities = []
        for _, row in df.iterrows():
            # Map Korean stages to our English keys
            stage_map = {
                "발굴": "Discovery",
                "제안": "Proposal",
                "협상": "Negotiation",
                "계약": "Closing",
                "종료": "Closing"
            }
            korean_stage = clean_value(row.get("단계"))
            stage = stage_map.get(korean_stage, "Discovery")
            
            try:
                value = int(row.get("예상매출", 0))
            except:
                value = 0

            opportunities.append({
                "id": clean_value(row.get("No")),
                "title": clean_value(row.get("영업기회명")),
                "company": clean_value(row.get("고객사")),
                "value": value,
                "stage": stage,
                "owner": clean_value(row.get("담당자")),
                "date": clean_value(row.get("예상종료일"))
            })
        ts_content.append(f"export const opportunities = {json.dumps(opportunities, ensure_ascii=False, indent=2)};")

    # Process Employees
    if os.path.exists(files["employees"]):
        df = pd.read_excel(files["employees"])
        employees = []
        for _, row in df.iterrows():
            employees.append({
                "id": clean_value(row.get("사번")),
                "name": clean_value(row.get("성명")),
                "role": clean_value(row.get("직급")),
                "email": clean_value(row.get("이메일")),
                "phone": clean_value(row.get("휴대전화")),
                "department": clean_value(row.get("부서"))
            })
        ts_content.append(f"export const employees = {json.dumps(employees, ensure_ascii=False, indent=2)};")

    # Write to file
    with open("src/lib/realData.ts", "w", encoding="utf-8") as f:
        f.write("\n\n".join(ts_content))
    
    print("Successfully generated src/lib/realData.ts")

if __name__ == "__main__":
    generate_ts_file()
