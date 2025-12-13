const { google } = require('googleapis');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const API_KEY = process.env.VITE_GOOGLE_API_KEY;

if (!FOLDER_ID) {
    console.error('❌ GOOGLE_DRIVE_FOLDER_ID 환경 변수가 설정되지 않았습니다.');
    console.log('   .env.local 에 다음을 추가하세요:');
    console.log('   GOOGLE_DRIVE_FOLDER_ID=1RqbKXjoS37iDmXDnN_UJHqnCB3AVjeWN');
    process.exit(1);
}

if (!API_KEY) {
    console.error('❌ VITE_GOOGLE_API_KEY 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
}

console.log('📂 Google Drive 폴더 ID:', FOLDER_ID);

// 지원하는 파일 확장자
const SUPPORTED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.csv', '.txt', '.md', '.docx', '.doc'];

// 다운로드 폴더
const DOWNLOAD_DIR = path.join(__dirname, '..', '.drive-cache');

// Google Drive API 클라이언트 초기화
const drive = google.drive({
    version: 'v3',
    auth: API_KEY
});

// 폴더 내 파일 목록 가져오기
async function listFiles(folderId, pageToken = null) {
    const files = [];

    try {
        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'nextPageToken, files(id, name, mimeType, size)',
            pageSize: 100,
            pageToken: pageToken
        });

        if (response.data.files) {
            files.push(...response.data.files);
        }

        // 다음 페이지가 있으면 재귀 호출
        if (response.data.nextPageToken) {
            const moreFiles = await listFiles(folderId, response.data.nextPageToken);
            files.push(...moreFiles);
        }
    } catch (error) {
        console.error('❌ 파일 목록 가져오기 실패:', error.message);
    }

    return files;
}

// 파일 다운로드
async function downloadFile(file) {
    const ext = path.extname(file.name).toLowerCase();

    // 지원하는 확장자 확인
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        console.log(`   ⏭️ 지원하지 않는 형식: ${file.name}`);
        return null;
    }

    const filePath = path.join(DOWNLOAD_DIR, file.name);

    // 이미 다운로드된 파일 확인 (캐싱)
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        // 파일 크기가 같으면 스킵
        if (file.size && stats.size === parseInt(file.size)) {
            console.log(`   ✅ 캐시 사용: ${file.name}`);
            return filePath;
        }
    }

    try {
        console.log(`   ⬇️ 다운로드 중: ${file.name}`);

        const response = await drive.files.get({
            fileId: file.id,
            alt: 'media'
        }, { responseType: 'arraybuffer' });

        fs.writeFileSync(filePath, Buffer.from(response.data));
        console.log(`   ✅ 다운로드 완료: ${file.name}`);
        return filePath;
    } catch (error) {
        console.error(`   ❌ 다운로드 실패: ${file.name}`, error.message);
        return null;
    }
}

// Google Docs/Sheets 내보내기
async function exportGoogleFile(file) {
    const mimeTypeMap = {
        'application/vnd.google-apps.document': { ext: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        'application/vnd.google-apps.spreadsheet': { ext: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        'application/vnd.google-apps.presentation': { ext: '.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
    };

    const exportInfo = mimeTypeMap[file.mimeType];
    if (!exportInfo) {
        return null;
    }

    const fileName = file.name + exportInfo.ext;
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    try {
        console.log(`   📤 내보내기 중: ${file.name}`);

        const response = await drive.files.export({
            fileId: file.id,
            mimeType: exportInfo.mimeType
        }, { responseType: 'arraybuffer' });

        fs.writeFileSync(filePath, Buffer.from(response.data));
        console.log(`   ✅ 내보내기 완료: ${fileName}`);
        return filePath;
    } catch (error) {
        console.error(`   ❌ 내보내기 실패: ${file.name}`, error.message);
        return null;
    }
}

// 메인 함수
async function main() {
    console.log('\n🔍 Google Drive 파일 검색 중...');

    // 다운로드 폴더 생성
    if (!fs.existsSync(DOWNLOAD_DIR)) {
        fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    }

    // 파일 목록 가져오기
    const files = await listFiles(FOLDER_ID);
    console.log(`✅ ${files.length}개 파일 발견\n`);

    const downloadedFiles = [];

    // 파일 다운로드
    for (const file of files) {
        // 폴더인 경우 하위 폴더 처리 (재귀)
        if (file.mimeType === 'application/vnd.google-apps.folder') {
            console.log(`📁 하위 폴더: ${file.name}`);
            const subFiles = await listFiles(file.id);
            for (const subFile of subFiles) {
                if (subFile.mimeType.startsWith('application/vnd.google-apps.')) {
                    const filePath = await exportGoogleFile(subFile);
                    if (filePath) downloadedFiles.push(filePath);
                } else {
                    const filePath = await downloadFile(subFile);
                    if (filePath) downloadedFiles.push(filePath);
                }
            }
            continue;
        }

        // Google 문서 형식
        if (file.mimeType.startsWith('application/vnd.google-apps.')) {
            const filePath = await exportGoogleFile(file);
            if (filePath) downloadedFiles.push(filePath);
        } else {
            // 일반 파일
            const filePath = await downloadFile(file);
            if (filePath) downloadedFiles.push(filePath);
        }
    }

    console.log(`\n✅ 총 ${downloadedFiles.length}개 파일 다운로드 완료`);
    console.log(`📁 캐시 폴더: ${DOWNLOAD_DIR}`);

    return downloadedFiles;
}

// 모듈로 내보내기
module.exports = { main, DOWNLOAD_DIR };

// 직접 실행 시
if (require.main === module) {
    main().catch(console.error);
}
