-- =====================================================
-- RAG Documents 테이블 및 함수 설정
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- 1. Vector 익스텐션 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. documents 테이블 생성
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(768),  -- Gemini embedding-001 차원
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 인덱스 생성 (벡터 검색 성능 향상)
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
ON documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. 메타데이터 검색용 인덱스
CREATE INDEX IF NOT EXISTS documents_metadata_idx 
ON documents 
USING GIN (metadata);

-- 5. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. match_documents RPC 함수 (유사도 검색)
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id BIGINT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        documents.id,
        documents.content,
        documents.metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 7. 테이블 설명 추가
COMMENT ON TABLE documents IS 'RAG 시스템용 문서 저장 테이블';
COMMENT ON COLUMN documents.content IS '문서 텍스트 내용 (청크)';
COMMENT ON COLUMN documents.metadata IS '파일명, 페이지 번호 등 메타데이터';
COMMENT ON COLUMN documents.embedding IS 'Gemini embedding-001 벡터 (768차원)';

-- 8. RLS 정책 설정 (선택사항 - 필요시 주석 해제)
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for authenticated users" ON documents FOR INSERT WITH CHECK (true);

-- =====================================================
-- 실행 완료 메시지
-- =====================================================
SELECT 'RAG Documents 테이블 및 match_documents 함수 생성 완료!' AS message;
