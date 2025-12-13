// 지식 데이터를 비동기로 로드
let knowledgeData: string | null = null;

export async function getCompanyKnowledge(): Promise<string> {
  if (knowledgeData) return knowledgeData;

  try {
    const response = await fetch('/knowledge.json');
    const data = await response.json();
    knowledgeData = data.knowledge;
    return knowledgeData || '';
  } catch (error) {
    console.error('지식 데이터 로드 실패:', error);
    return '회사 지식 데이터를 로드할 수 없습니다.';
  }
}

// 간단한 시스템 프롬프트용 요약 (직접 포함)
export const COMPANY_KNOWLEDGE_SUMMARY = `
컨범코리아 CRM 시스템입니다.
이 시스템은 고객 관리, 매출 분석, 견적 관리 등을 담당합니다.
자세한 정보는 사용자의 질문에 따라 지식 데이터에서 검색됩니다.
`;

export const KNOWLEDGE_METADATA = {
  generatedAt: new Date().toISOString(),
  sourcePath: '/Users/hyeonhotak/Downloads/코딩/convum-crm',
  fileCount: 22,
  files: []
};
