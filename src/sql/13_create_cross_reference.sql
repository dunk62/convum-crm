-- 경쟁사 치환 가이드 테이블 생성
CREATE TABLE IF NOT EXISTS cross_references (
    id SERIAL PRIMARY KEY,
    maker VARCHAR(100),
    competitor_model VARCHAR(255),
    search_keyword VARCHAR(255),
    convum_model VARCHAR(255),
    compatibility_grade CHAR(1) CHECK (compatibility_grade IN ('A', 'B', 'C')),
    tech_checkpoint TEXT,
    sales_point TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS 활성화
ALTER TABLE cross_references ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 읽기 허용
CREATE POLICY "Allow read access to all users" ON cross_references
    FOR SELECT USING (true);

-- 인증된 사용자 수정 허용
CREATE POLICY "Allow authenticated users to modify" ON cross_references
    FOR ALL USING (auth.role() = 'authenticated');

-- 검색 최적화를 위한 인덱스
CREATE INDEX idx_cross_ref_search_keyword ON cross_references(search_keyword);
CREATE INDEX idx_cross_ref_competitor_model ON cross_references(competitor_model);
CREATE INDEX idx_cross_ref_convum_model ON cross_references(convum_model);
CREATE INDEX idx_cross_ref_maker ON cross_references(maker);

-- 코멘트 추가
COMMENT ON TABLE cross_references IS '경쟁사 제품 치환 가이드 - SMC, 브이메카, 피스코 등 타사 제품과 당사(CONVUM) 제품 간 호환 정보';
COMMENT ON COLUMN cross_references.compatibility_grade IS 'A: 완벽 호환, B: 주의 요망, C: 개조 필요';
