-- 견적 이력 테이블
CREATE TABLE IF NOT EXISTS quote_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT NOT NULL UNIQUE,
    recipient TEXT NOT NULL,
    reference TEXT,
    quote_date DATE NOT NULL,
    validity_date DATE,
    delivery_date TEXT,
    payment_terms TEXT DEFAULT '정기결제',
    total_amount NUMERIC DEFAULT 0,
    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 견적 품목 테이블
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quote_history(id) ON DELETE CASCADE,
    seq_no INTEGER NOT NULL,
    product_category TEXT,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    standard_price NUMERIC DEFAULT 0,
    special_price NUMERIC DEFAULT 0,
    discount_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_quote_history_quote_number ON quote_history(quote_number);
CREATE INDEX IF NOT EXISTS idx_quote_history_created_at ON quote_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);

-- RLS 설정
ALTER TABLE quote_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for quote_history" ON quote_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for quote_items" ON quote_items FOR ALL USING (true) WITH CHECK (true);

-- 견적번호 자동 생성 함수 (형식: 2025-1211S-01)
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
    date_part TEXT;
    seq_num INTEGER;
    new_quote_number TEXT;
BEGIN
    -- 날짜 부분: YYYY-MMDD (예: 2025-1211)
    date_part := TO_CHAR(NOW(), 'YYYY-MMDD');
    
    -- 해당 일자의 시퀀스 번호 조회
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(quote_number FROM '[0-9]+$') AS INTEGER)
    ), 0) + 1
    INTO seq_num
    FROM quote_history
    WHERE quote_number LIKE date_part || 'S-%';
    
    -- 최종 견적번호: YYYY-MMDDS-01
    new_quote_number := date_part || 'S-' || LPAD(seq_num::TEXT, 2, '0');
    
    RETURN new_quote_number;
END;
$$ LANGUAGE plpgsql;
