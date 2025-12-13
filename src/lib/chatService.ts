import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';
import { DB_SCHEMA } from './dbSchema';

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// 채팅 메시지 타입
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
import { SchemaType } from '@google/generative-ai';

// execute_sql 도구 정의
const tools = [
    {
        functionDeclarations: [
            {
                name: 'execute_sql',
                description: 'PostgreSQL SELECT 쿼리를 실행하여 데이터베이스에서 데이터를 조회합니다. INSERT, UPDATE, DELETE 등 수정 쿼리는 허용되지 않습니다.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        sql_query: {
                            type: SchemaType.STRING,
                            description: '실행할 PostgreSQL SELECT 쿼리'
                        }
                    },
                    required: ['sql_query']
                }
            }
        ]
    }
];

// SQL 쿼리 실행 함수
async function executeSqlQuery(sqlQuery: string): Promise<string> {
    try {
        // 쿼리 정규화: 줄바꿈/탭/여러 공백을 단일 공백으로 변환, 세미콜론 제거
        const cleanQuery = sqlQuery
            .replace(/[\r\n\t]+/g, ' ')  // 줄바꿈, 탭을 공백으로
            .replace(/\s+/g, ' ')         // 여러 공백을 단일 공백으로
            .replace(/;\s*$/, '')         // 끝 세미콜론 제거
            .trim();
        console.log('🔍 SQL 쿼리 실행:', cleanQuery);

        const { data, error } = await supabase.rpc('query_data', {
            query: cleanQuery
        });

        console.log('📊 RPC 결과:', { data, error });

        if (error) {
            console.error('❌ SQL 실행 오류:', error);
            // 에러 메시지에서 유용한 정보 추출
            return `SQL 오류: ${error.message}\n힌트: ${error.hint || '없음'}\n코드: ${error.code || '없음'}`;
        }

        if (!data || (Array.isArray(data) && data.length === 0)) {
            return '조회 결과가 없습니다. 조건을 변경해서 다시 시도해보세요.';
        }

        // 결과 포맷팅 (최대 20행)
        const results = Array.isArray(data) ? data : [data];
        const limitedResults = results.slice(0, 20);

        let resultText = `✅ 총 ${results.length}개 결과 중 ${limitedResults.length}개 표시:\n\n`;
        resultText += JSON.stringify(limitedResults, null, 2);

        // 민감정보 마스킹
        resultText = resultText.replace(/password["\s:]+["']?[^"',}\s]+/gi, 'password: "***MASKED***"');
        resultText = resultText.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****'); // SSN 형식

        return resultText;
    } catch (error: any) {
        console.error('❌ SQL 실행 실패:', error);
        return `실행 오류: ${error.message || error}`;
    }
}

// 시스템 프롬프트 생성
function getSystemPrompt(): string {
    return `당신은 우리 회사의 데이터베이스 관리자 AI입니다.
사용자의 질문에 답하기 위해 필요한 SQL(PostgreSQL) 쿼리를 생성하고 execute_sql 도구로 실행하세요.

## 규칙
1. 오직 SELECT 쿼리만 사용하세요. INSERT, UPDATE, DELETE는 금지입니다.
2. 비밀번호, 개인정보(주민번호 등)는 마스킹해서 보여주세요.
3. 쿼리 결과를 바탕으로 사용자에게 친절하게 답변하세요.
4. 결과가 많으면 요약해서 보여주세요.
5. 한국어로 답변하세요.
6. **중요: SQL 코드는 사용자에게 절대 보여주지 마세요.** 쿼리는 내부적으로 실행하고 결과만 자연어로 설명하세요.

## 검색 팁
- 사람 이름 검색 시: content, title, contact_name 모든 컬럼에서 LIKE '%이름%'로 검색
- data_records 테이블 검색 시: content 또는 title 컬럼에 정보가 있을 수 있음
- 결과가 없으면 더 넓은 조건으로 재검색

## 중요: 쿼리 오류 발생 시
- 오류가 발생하면 먼저 해당 테이블에서 샘플 데이터를 조회하세요
- 샘플 데이터를 보고 실제 컬럼 형식을 파악한 후 다시 쿼리하세요

## 현재 데이터베이스 구조
${DB_SCHEMA}

## 예시 질문과 응답
- "고객 목록 보여줘" → 고객 목록을 조회하고 결과를 표로 정리해서 보여줌
- "이은실 대화내용" → data_records에서 title, content, contact_name 전체에서 검색
- "삼성전자 메모 내용" → opportunity_memos와 opportunities를 JOIN해서 해당 업체 메모 조회
- "최근 영업 메모" → opportunity_memos에서 최근 메모 조회
- "OO업체 영업 기회 현황" → opportunities에서 해당 업체 조회 후 관련 메모도 함께 조회
- "25년 12월 총 매출 실적" → sales_performance 테이블에서 해당 월의 매출 합계 조회
- "이번달 매출" → sales_performance 테이블에서 현재 월의 매출 합계 조회

## 매출 실적 조회 쿼리 예시 (sales_performance 테이블 사용)
- 특정 월 총 매출: SELECT SUM(sales_amount) as total_sales FROM sales_performance WHERE shipment_date >= '2025-12-01' AND shipment_date <= '2025-12-31'
- 담당자별 매출: SELECT sales_rep, SUM(sales_amount) as total_sales FROM sales_performance WHERE shipment_date >= '2025-12-01' AND shipment_date <= '2025-12-31' GROUP BY sales_rep ORDER BY total_sales DESC
- 상품군별 매출: SELECT product_name, SUM(sales_amount) as total_sales FROM sales_performance WHERE shipment_date >= '2025-12-01' AND shipment_date <= '2025-12-31' GROUP BY product_name ORDER BY total_sales DESC

## 메모 조회 쿼리 예시
- 특정 업체 메모: SELECT m.content, m.created_at, o.title, o.company FROM opportunity_memos m JOIN opportunities o ON m.opportunity_id = o.id WHERE o.company LIKE '%업체명%' ORDER BY m.created_at DESC
- 최근 메모: SELECT m.content, m.created_at, o.company FROM opportunity_memos m JOIN opportunities o ON m.opportunity_id = o.id ORDER BY m.created_at DESC LIMIT 10
`;
}

// 채팅 서비스 클래스
class ChatService {
    private model: any;
    private chat: any;

    constructor() {
        try {
            this.model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                systemInstruction: getSystemPrompt(),
                tools: tools as any
            });
            this.chat = this.model.startChat();
        } catch (error) {
            console.error('Gemini 모델 초기화 실패:', error);
        }
    }

    // 도구 호출 처리
    async handleFunctionCall(functionCall: any): Promise<string> {
        const { name, args } = functionCall;

        if (name === 'execute_sql') {
            return await executeSqlQuery(args.sql_query);
        }

        return '알 수 없는 도구입니다.';
    }

    // 메시지 전송 (Function Calling 지원)
    async sendMessage(message: string): Promise<string> {
        if (!this.model) {
            throw new Error('채팅 서비스가 초기화되지 않았습니다.');
        }

        try {
            let result = await this.chat.sendMessage(message);
            let response = await result.response;

            // Function Call 처리 루프
            let functionCalls = response.functionCalls?.() || [];

            while (functionCalls && functionCalls.length > 0) {
                const functionResponses = [];

                for (const fc of functionCalls) {
                    console.log('🔧 도구 호출:', fc.name);
                    const functionResult = await this.handleFunctionCall(fc);
                    functionResponses.push({
                        functionResponse: {
                            name: fc.name,
                            response: { result: functionResult }
                        }
                    });
                }

                // 도구 결과를 모델에 전달
                result = await this.chat.sendMessage(functionResponses);
                response = await result.response;
                functionCalls = response.functionCalls?.() || [];
            }

            return response.text();
        } catch (error: any) {
            console.error('메시지 전송 실패:', error);
            throw new Error(`응답 생성 실패: ${error.message}`);
        }
    }

    // 채팅 히스토리 초기화
    resetChat() {
        if (this.model) {
            this.chat = this.model.startChat();
        }
    }

    // 스트리밍 응답 (Function Calling은 스트리밍 미지원, 일반 응답으로 대체)
    async *sendMessageStream(message: string): AsyncGenerator<string> {
        const response = await this.sendMessage(message);
        yield response;
    }
}

// 싱글톤 인스턴스
let chatServiceInstance: ChatService | null = null;

export function getChatService(): ChatService {
    if (!chatServiceInstance) {
        chatServiceInstance = new ChatService();
    }
    return chatServiceInstance;
}

export function resetChatService(): void {
    if (chatServiceInstance) {
        chatServiceInstance.resetChat();
    }
}
