import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

const DRIVE_PATH = process.env.DRIVE_PATH;

if (!DRIVE_PATH) {
    console.error('❌ DRIVE_PATH 환경 변수가 설정되지 않았습니다.');
    console.error('   .env.local 파일에 DRIVE_PATH=/path/to/data 형식으로 추가해주세요.');
    process.exit(1);
}

console.log(`📂 데이터 소스 경로: ${DRIVE_PATH}`);

// 지원하는 파일 확장자
const SUPPORTED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.csv', '.txt', '.md'];

// node_modules, .git 등 제외 폴더
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', '.next', '.vercel', '.gemini'];

// 재귀적으로 파일 찾기
function findFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
        console.error(`❌ 경로가 존재하지 않습니다: ${dir}`);
        return files;
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        // 제외 폴더 건너뛰기
        if (item.isDirectory() && EXCLUDED_DIRS.includes(item.name)) {
            continue;
        }

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

// 텍스트 파일 읽기 (.txt, .md)
function readTextFile(filePath: string): string {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return `\n\n--- 파일: ${path.basename(filePath)} ---\n${content}`;
    } catch (err) {
        console.error(`⚠️ 텍스트 파일 읽기 실패: ${filePath}`, err);
        return '';
    }
}

// Excel/CSV 파일 읽기
async function readExcelFile(filePath: string): Promise<string> {
    try {
        // ESM 동적 import
        const XLSX = await import('xlsx');
        const workbook = XLSX.readFile(filePath);
        let content = `\n\n--- 파일: ${path.basename(filePath)} ---\n`;

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { header: 1 });

            if (data.length === 0) continue;

            content += `\n[시트: ${sheetName}]\n`;

            // 헤더 추출 (첫 번째 행)
            const headers = (data[0] as any[]) || [];

            // 데이터 행 처리 (최대 100행)
            const maxRows = Math.min(data.length, 100);
            for (let i = 1; i < maxRows; i++) {
                const row = data[i] as any[];
                if (!row || row.every(cell => cell === undefined || cell === null || cell === '')) continue;

                const rowData: string[] = [];
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
        console.error(`⚠️ Excel/CSV 파일 읽기 실패: ${filePath}`, err);
        return '';
    }
}

// PDF 파일 읽기
async function readPdfFile(filePath: string): Promise<string> {
    try {
        const pdfParse = (await import('pdf-parse')).default;
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return `\n\n--- 파일: ${path.basename(filePath)} ---\n${data.text}`;
    } catch (err) {
        console.error(`⚠️ PDF 파일 읽기 실패: ${filePath}`, err);
        return '';
    }
}

// 메인 함수
async function main() {
    console.log('\n🔍 파일 검색 중...');
    const files = findFiles(DRIVE_PATH, SUPPORTED_EXTENSIONS);

    if (files.length === 0) {
        console.log('⚠️ 지원되는 파일을 찾지 못했습니다.');
        console.log(`   지원 확장자: ${SUPPORTED_EXTENSIONS.join(', ')}`);
        process.exit(0);
    }

    console.log(`✅ ${files.length}개 파일 발견\n`);

    let allContent = '';

    // 파일별 처리
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        console.log(`📄 처리 중: ${path.basename(file)}`);

        try {
            if (ext === '.txt' || ext === '.md') {
                allContent += readTextFile(file);
            } else if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
                allContent += await readExcelFile(file);
            } else if (ext === '.pdf') {
                allContent += await readPdfFile(file);
            }
        } catch (err) {
            console.error(`❌ 파일 처리 오류: ${file}`, err);
        }
    }

    // companyData.ts 파일 생성
    const outputDir = path.join(__dirname, '..', 'src', 'lib');
    const outputPath = path.join(outputDir, 'companyData.ts');

    // 디렉토리 생성 (없으면)
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 특수 문자 이스케이프
    const escapedContent = allContent
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');

    const outputContent = `// 자동 생성된 파일 - 직접 수정하지 마세요
// 생성일시: ${new Date().toISOString()}
// 데이터 소스: ${DRIVE_PATH}
// 파일 수: ${files.length}

export const COMPANY_KNOWLEDGE = \`${escapedContent}\`;

export const KNOWLEDGE_METADATA = {
    generatedAt: '${new Date().toISOString()}',
    sourcePath: '${DRIVE_PATH}',
    fileCount: ${files.length},
    files: ${JSON.stringify(files.map(f => path.basename(f)), null, 2)}
};
`;

    fs.writeFileSync(outputPath, outputContent, 'utf-8');
    console.log(`\n✅ 지식 데이터 생성 완료: ${outputPath}`);
    console.log(`📊 총 문자 수: ${allContent.length.toLocaleString()}자`);
}

main().catch(console.error);
