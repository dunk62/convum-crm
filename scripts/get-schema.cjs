const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
}

console.log('🔗 Supabase URL:', SUPABASE_URL);

// 스키마 정보 조회
async function getSchemaInfo() {
    const query = `
        SELECT 
            table_name,
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
    `;

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            // RPC가 없으면 직접 information_schema 조회 시도
            console.log('⚠️ query_data RPC 없음, 대체 방법 시도...');
            return await getSchemaAlternative();
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('스키마 조회 실패:', error);
        return await getSchemaAlternative();
    }
}

// 대체 방법: REST API로 테이블 목록 가져오기
async function getSchemaAlternative() {
    // 알려진 테이블 목록 하드코딩 (나중에 수동 업데이트 필요)
    const knownTables = [
        'companies', 'contacts', 'opportunities', 'opportunity_todos',
        'employees', 'sales_performance', 'order_performance',
        'special_quotes', 'quote_items', 'quote_links', 'quote_history', 'quote_views',
        'model_product_mapping', 'documents',
        'sample_inventory', 'sample_rentals', 'cross_references',
        'email_queue', 'data_records', 'vacuum_transfer_references'
    ];

    let schemaInfo = [];

    for (const tableName of knownTables) {
        try {
            // 테이블 첫 행만 조회해서 컬럼 정보 추출
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?limit=1`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=representation'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const columns = Object.keys(data[0]);
                    columns.forEach(col => {
                        schemaInfo.push({
                            table_name: tableName,
                            column_name: col,
                            data_type: typeof data[0][col],
                            is_nullable: 'YES'
                        });
                    });
                }
            }
        } catch (e) {
            console.log(`⚠️ 테이블 ${tableName} 조회 실패`);
        }
    }

    return schemaInfo;
}

// 스키마 정보를 읽기 쉬운 형식으로 포맷
function formatSchema(schemaInfo) {
    const tables = {};

    for (const row of schemaInfo) {
        const tableName = row.table_name;
        if (!tables[tableName]) {
            tables[tableName] = [];
        }
        tables[tableName].push({
            column: row.column_name,
            type: row.data_type,
            nullable: row.is_nullable === 'YES'
        });
    }

    let schemaText = '';
    for (const [tableName, columns] of Object.entries(tables)) {
        schemaText += `\n테이블: ${tableName}\n`;
        schemaText += '컬럼:\n';
        for (const col of columns) {
            schemaText += `  - ${col.column}: ${col.type}${col.nullable ? ' (nullable)' : ''}\n`;
        }
    }

    return schemaText;
}

// 메인 함수
async function main() {
    console.log('\n🔍 데이터베이스 스키마 조회 중...');

    const schemaInfo = await getSchemaInfo();

    if (!schemaInfo || schemaInfo.length === 0) {
        console.error('❌ 스키마 정보를 가져올 수 없습니다.');
        process.exit(1);
    }

    console.log(`✅ ${schemaInfo.length}개 컬럼 정보 발견`);

    const formattedSchema = formatSchema(schemaInfo);

    // dbSchema.ts 파일 생성
    const outputDir = path.join(__dirname, '..', 'src', 'lib');
    const outputPath = path.join(outputDir, 'dbSchema.ts');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputContent = `// 자동 생성된 파일 - npm run update-schema 명령으로 업데이트하세요
// 생성일시: ${new Date().toISOString()}

export const DB_SCHEMA = \`${formattedSchema.replace(/`/g, '\\`')}\`;

export const SCHEMA_METADATA = {
    generatedAt: '${new Date().toISOString()}',
    tableCount: ${Object.keys(schemaInfo.reduce((acc, row) => { acc[row.table_name] = true; return acc; }, {})).length}
};
`;

    fs.writeFileSync(outputPath, outputContent, 'utf-8');
    console.log(`\n✅ 스키마 저장 완료: ${outputPath}`);
    console.log(formattedSchema);
}

main().catch(console.error);
