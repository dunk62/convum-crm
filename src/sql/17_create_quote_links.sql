-- 견적서 링크 및 열람 추적 테이블
-- 테이블 생성
CREATE TABLE IF NOT EXISTS quote_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID REFERENCES quote_history(id) ON DELETE CASCADE,
    quote_number TEXT NOT NULL,
    recipient TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    is_active BOOLEAN DEFAULT TRUE
);

-- 견적서 열람 기록 테이블
CREATE TABLE IF NOT EXISTS quote_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_link_id UUID REFERENCES quote_links(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    viewer_ip TEXT,
    user_agent TEXT,
    referrer TEXT
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_quote_links_short_code ON quote_links(short_code);
CREATE INDEX IF NOT EXISTS idx_quote_links_quote_number ON quote_links(quote_number);
CREATE INDEX IF NOT EXISTS idx_quote_views_link_id ON quote_views(quote_link_id);

-- RLS 정책 설정
ALTER TABLE quote_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_views ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 quote_links 조회 가능 (공유 링크이므로)
CREATE POLICY "Anyone can view quote links" ON quote_links
    FOR SELECT USING (true);

-- 인증된 사용자만 quote_links 생성 가능
CREATE POLICY "Authenticated users can create quote links" ON quote_links
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 모든 사용자가 quote_views 생성 가능 (열람 기록)
CREATE POLICY "Anyone can create quote views" ON quote_views
    FOR INSERT WITH CHECK (true);

-- 인증된 사용자만 quote_views 조회 가능
CREATE POLICY "Authenticated users can view quote views" ON quote_views
    FOR SELECT USING (auth.role() = 'authenticated');

-- Storage bucket 생성 (Supabase 대시보드에서 수동으로 생성 필요)
-- 버킷 이름: quotes
-- Public: false (signed URLs 사용)

-- 뷰 카운트 함수
CREATE OR REPLACE FUNCTION get_quote_view_count(link_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM quote_views WHERE quote_link_id = link_id);
END;
$$ LANGUAGE plpgsql;
