const { google } = require('googleapis');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Node.js 18+ has native fetch

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

// 수주실적 Google Drive 폴더 ID
const FOLDER_ID = '1JW3xIvQqrSUxkE5bovPyvLcXVqmP0QIQ';
const API_KEY = process.env.VITE_GOOGLE_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!API_KEY) {
    console.error('❌ VITE_GOOGLE_API_KEY 환경 변수가 필요합니다.');
    process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase 환경 변수가 필요합니다.');
    process.exit(1);
}

console.log('📂 수주실적 Google Drive 폴더:', FOLDER_ID);

// 캐시 디렉토리
const CACHE_DIR = path.join(__dirname, '..', '.order-cache');

// Google Drive API 클라이언트
const drive = google.drive({ version: 'v3', auth: API_KEY });

// 파일 목록 가져오기
async function listFiles() {
    try {
        const response = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, modifiedTime)',
            orderBy: 'modifiedTime desc'
        });
        return response.data.files || [];
    } catch (error) {
        console.error('❌ 파일 목록 가져오기 실패:', error.message);
        return [];
    }
}

// 파일 다운로드
async function downloadFile(file) {
    const filePath = path.join(CACHE_DIR, file.name);

    try {
        console.log(`   ⬇️ 다운로드 중: ${file.name}`);
        const response = await drive.files.get(
            { fileId: file.id, alt: 'media' },
            { responseType: 'arraybuffer' }
        );
        fs.writeFileSync(filePath, Buffer.from(response.data));
        console.log(`   ✅ 다운로드 완료: ${file.name}`);
        return filePath;
    } catch (error) {
        console.error(`   ❌ 다운로드 실패: ${file.name}`, error.message);
        return null;
    }
}

// 엑셀 파일 파싱 - 모든 시트에서 주문 데이터 추출
function parseExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    let allRecords = [];

    // 각 시트 처리 (날짜별 시트)
    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });

        // 시트에서 날짜 추출 (예: '2025.12.5(FRI)' -> '2025-12-05')
        const dateMatch = sheetName.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
        const orderDate = dateMatch
            ? `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`
            : null;

        // 데이터 행 찾기 (보통 30행 이후부터 실제 주문 데이터)
        for (let i = 16; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length < 10) continue;

            // 유효한 주문 행인지 확인 (대리점명과 업체명이 있어야 함)
            const distributor = String(row[0] || '').trim();
            const company = String(row[1] || '').trim();

            // 빈 행이나 헤더 행 스킵
            if (!distributor || !company) continue;
            if (distributor === '受注報告' || distributor === '受注額') continue;
            if (distributor.includes('合計') || distributor.includes('販賣')) continue;

            const record = {
                order_date: orderDate,
                distributor_name: distributor,
                company_name: company,
                sales_rep: String(row[3] || '').trim(),
                product_name: String(row[5] || '').trim(),
                model_number: String(row[7] || '').trim(),
                quantity: parseInt(row[9]) || 0,
                unit_price: parseInt(row[11]) || 0,
                total_amount: parseInt(row[12]) || 0
            };

            // 수량이나 금액이 있는 유효한 레코드만 추가
            if (record.quantity > 0 || record.total_amount > 0) {
                allRecords.push(record);
            }
        }
    }

    return allRecords;
}

// Supabase에 데이터 삽입
async function insertOrderData(records) {
    console.log(`\n📊 ${records.length}개 레코드 처리 중...`);

    // 기존 데이터 삭제 (옵션)
    // await fetch(`${SUPABASE_URL}/rest/v1/order_performance`, {
    //     method: 'DELETE',
    //     headers: {
    //         'apikey': SUPABASE_ANON_KEY,
    //         'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    //         'Prefer': 'return=minimal'
    //     }
    // });

    // 배치로 삽입
    const BATCH_SIZE = 100;
    let inserted = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);

        const response = await fetch(`${SUPABASE_URL}/rest/v1/order_performance`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(batch)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`❌ 삽입 오류:`, error);
        } else {
            inserted += batch.length;
            console.log(`   ✅ ${inserted}/${records.length} 삽입 완료`);
        }
    }

    return inserted;
}

// 메인 함수
async function main() {
    console.log('\n🔍 수주실적 파일 검색 중...');

    // 캐시 폴더 생성
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // 파일 목록 가져오기
    const files = await listFiles();
    console.log(`✅ ${files.length}개 파일 발견`);

    if (files.length === 0) {
        console.log('⚠️ 처리할 파일이 없습니다.');
        return;
    }

    // 최신 엑셀 파일 찾기
    const excelFiles = files.filter(f =>
        f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv')
    );

    if (excelFiles.length === 0) {
        console.log('⚠️ 엑셀/CSV 파일을 찾을 수 없습니다.');
        return;
    }

    console.log(`\n📄 처리할 파일: ${excelFiles.map(f => f.name).join(', ')}`);

    let allRecords = [];

    for (const file of excelFiles) {
        const filePath = await downloadFile(file);
        if (!filePath) continue;

        try {
            console.log(`   📊 파싱 중: ${file.name}`);
            // parseExcelFile이 이제 직접 order records를 반환
            const records = parseExcelFile(filePath);
            console.log(`   📊 ${records.length}개 유효 레코드`);

            allRecords.push(...records);
        } catch (err) {
            console.error(`   ❌ 파싱 오류: ${file.name}`, err.message);
        }
    }

    if (allRecords.length > 0) {
        const inserted = await insertOrderData(allRecords);
        console.log(`\n✅ 총 ${inserted}개 수주실적 레코드 업데이트 완료!`);
    } else {
        console.log('\n⚠️ 삽입할 레코드가 없습니다.');
    }
}

main().catch(console.error);
