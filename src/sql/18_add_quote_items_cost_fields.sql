-- quote_items 테이블에 원가 분석 필드 추가
ALTER TABLE quote_items 
ADD COLUMN IF NOT EXISTS cost_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS cost_price_lot INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS moq INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS company_profit_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS store_profit_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS nego_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS expected_delivery TEXT DEFAULT '';

-- 주석 추가
COMMENT ON COLUMN quote_items.cost_price IS '판매원가';
COMMENT ON COLUMN quote_items.cost_price_lot IS '원가 LOT';
COMMENT ON COLUMN quote_items.user_price IS '유저가';
COMMENT ON COLUMN quote_items.moq IS 'MOQ (최소주문수량)';
COMMENT ON COLUMN quote_items.company_profit_rate IS '당사이익률';
COMMENT ON COLUMN quote_items.store_profit_rate IS '판매점가이익률';
COMMENT ON COLUMN quote_items.nego_rate IS '네고율';
COMMENT ON COLUMN quote_items.expected_delivery IS '예상납기';
