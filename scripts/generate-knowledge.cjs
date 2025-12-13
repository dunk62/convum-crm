const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const XLSX = require('xlsx');

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

const DRIVE_PATH = process.env.DRIVE_PATH;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Google Drive 연동 여부
const USE_GOOGLE_DRIVE = !!GOOGLE_DRIVE_FOLDER_ID;

if (!DRIVE_PATH && !USE_GOOGLE_DRIVE) {
    console.error('❌ DRIVE_PATH 또는 GOOGLE_DRIVE_FOLDER_ID 환경 변수가 필요합니다.');
    process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
    console.error('   VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 .env.local에 추가하세요.');
    process.exit(1);
}

if (!GEMINI_API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
}

if (DRIVE_PATH) console.log(`📂 로컬 데이터 소스: ${DRIVE_PATH}`);
if (USE_GOOGLE_DRIVE) console.log(`☁️ Google Drive 폴더: ${GOOGLE_DRIVE_FOLDER_ID}`);
console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);

// 지원하는 파일 확장자
const SUPPORTED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.csv', '.txt', '.md', '.docx'];

// 제외 폴더
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', '.next', '.vercel', '.gemini', 'scripts'];

// 청크 설정
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

// 재귀적으로 파일 찾기
function findFiles(dir, extensions) {
    const files = [];
    if (!fs.existsSync(dir)) {
        console.error(`❌ 경로가 존재하지 않습니다: ${dir}`);
        return files;
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory() && EXCLUDED_DIRS.includes(item.name)) continue;
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files.push(...findFiles(fullPath, extensions));
        } else if (item.isFile()) {
            const ext = path.extname(item.name).toLowerCase();
            if (extensions.includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}

// 텍스트 파일 읽기
function readTextFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        console.error(`⚠️ 텍스트 파일 읽기 실패: ${filePath}`, err.message);
        return '';
    }
}

// Excel/CSV 파일 읽기
function readExcelFile(filePath) {
    try {
        const workbook = XLSX.readFile(filePath);
        let content = '';
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (data.length === 0) continue;
            content += `\n[시트: ${sheetName}]\n`;
            const headers = data[0] || [];
            const maxRows = Math.min(data.length, 100);
            for (let i = 1; i < maxRows; i++) {
                const row = data[i];
                if (!row || row.every(cell => cell === undefined || cell === null || cell === '')) continue;
                const rowData = [];
                for (let j = 0; j < row.length; j++) {
                    if (row[j] !== undefined && row[j] !== null && row[j] !== '') {
                        const header = headers[j] || `Column${j + 1}`;
                        rowData.push(`${header}: ${row[j]}`);
                    }
                }
                if (rowData.length > 0) {
                    content += rowData.join(', ') + '\n';
                }
            }
        }
        return content;
    } catch (err) {
        console.error(`⚠️ Excel/CSV 파일 읽기 실패: ${filePath}`, err.message);
        return '';
    }
}

// PDF 파일 읽기
async function readPdfFile(filePath) {
    try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (err) {
        console.error(`⚠️ PDF 파일 읽기 실패: ${filePath}`, err.message);
        return '';
    }
}

// 텍스트를 청크로 분할 (RecursiveCharacterTextSplitter 대체)
function splitTextIntoChunks(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
    const chunks = [];
    if (!text || text.length === 0) return chunks;

    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.substring(start, end));
        start += chunkSize - overlap;
        if (start >= text.length) break;
    }
    return chunks;
}

// Gemini embedding-001로 임베딩 생성
async function generateEmbedding(text) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'models/embedding-001',
                content: { parts: [{ text }] }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Embedding API 오류: ${response.status} - ${error}`);
        }

        const data = await response.json();
        return data.embedding.values;
    } catch (err) {
        console.error(`⚠️ 임베딩 생성 실패:`, err.message);
        return null;
    }
}

// Supabase에 문서 upsert
async function upsertDocument(content, metadata, embedding) {
    const url = `${SUPABASE_URL}/rest/v1/documents`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                content,
                metadata,
                embedding: `[${embedding.join(',')}]`
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Supabase 업로드 오류: ${response.status} - ${error}`);
        }

        return true;
    } catch (err) {
        console.error(`⚠️ Supabase 업로드 실패:`, err.message);
        return false;
    }
}

// 기존 documents 삭제
async function clearDocuments() {
    const url = `${SUPABASE_URL}/rest/v1/documents?id=gt.0`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            console.warn(`⚠️ 기존 문서 삭제 실패 (무시됨): ${error}`);
        } else {
            console.log('🗑️ 기존 문서 삭제 완료');
        }
    } catch (err) {
        console.warn(`⚠️ 기존 문서 삭제 실패 (무시됨):`, err.message);
    }
}

// 메인 함수
async function main() {
    let files = [];

    // 로컬 파일 검색
    if (DRIVE_PATH) {
        console.log('\n🔍 로컬 파일 검색 중...');
        const localFiles = findFiles(DRIVE_PATH, SUPPORTED_EXTENSIONS);
        console.log(`   📁 로컬: ${localFiles.length}개 파일`);
        files.push(...localFiles);
    }

    // Google Drive 파일 다운로드
    if (USE_GOOGLE_DRIVE) {
        console.log('\n☁️ Google Drive 파일 다운로드 중...');
        try {
            const { main: downloadFromDrive, DOWNLOAD_DIR } = require('./download-drive.cjs');
            const driveFiles = await downloadFromDrive();
            console.log(`   ☁️ Drive: ${driveFiles.length}개 파일`);
            files.push(...driveFiles);
        } catch (error) {
            console.error('❌ Google Drive 다운로드 실패:', error.message);
            console.log('   로컬 파일만 처리합니다.');
        }
    }

    if (files.length === 0) {
        console.log('⚠️ 지원되는 파일을 찾지 못했습니다.');
        process.exit(0);
    }

    console.log(`\n✅ 총 ${files.length}개 파일 발견\n`);

    // 기존 문서 삭제
    await clearDocuments();

    let totalChunks = 0;
    let uploadedChunks = 0;

    // 파일별 처리
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const fileName = path.basename(file);
        console.log(`📄 처리 중: ${fileName}`);

        let content = '';
        try {
            if (ext === '.txt' || ext === '.md') {
                content = readTextFile(file);
            } else if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
                content = readExcelFile(file);
            } else if (ext === '.pdf') {
                content = await readPdfFile(file);
            }
        } catch (err) {
            console.error(`❌ 파일 처리 오류: ${file}`, err.message);
            continue;
        }

        if (!content || content.trim().length === 0) {
            console.log(`   ⚠️ 내용 없음, 건너뜀`);
            continue;
        }

        // 청크 분할
        const chunks = splitTextIntoChunks(content);
        console.log(`   📦 ${chunks.length}개 청크 생성`);
        totalChunks += chunks.length;

        // 각 청크에 대해 임베딩 생성 및 업로드
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const metadata = {
                fileName,
                filePath: file,
                chunkIndex: i,
                totalChunks: chunks.length
            };

            // 임베딩 생성
            const embedding = await generateEmbedding(chunk);
            if (!embedding) {
                console.log(`   ⚠️ 청크 ${i + 1} 임베딩 실패, 건너뜀`);
                continue;
            }

            // Supabase에 업로드
            const success = await upsertDocument(chunk, metadata, embedding);
            if (success) {
                uploadedChunks++;
            }

            // Rate limiting 방지
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    console.log(`\n✅ 업로드 완료!`);
    console.log(`📊 총 청크: ${totalChunks}개`);
    console.log(`✅ 업로드 성공: ${uploadedChunks}개`);
    console.log(`❌ 업로드 실패: ${totalChunks - uploadedChunks}개`);
}

main().catch(console.error);
