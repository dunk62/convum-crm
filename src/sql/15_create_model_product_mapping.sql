-- 형번-상품군 영구 매핑 테이블 생성
-- 엑셀 import 시 RED/BLUE/NO LOGO를 올바른 상품군으로 변환하는데 사용

CREATE TABLE IF NOT EXISTS model_product_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_number TEXT UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_model_product_mapping_model_number 
ON model_product_mapping(model_number);

-- 기존 sales_performance 데이터에서 유효한 매핑 추출
INSERT INTO model_product_mapping (model_number, product_name)
SELECT DISTINCT ON (model_number) model_number, product_name
FROM sales_performance
WHERE product_name NOT IN ('RED', 'BLUE', 'NO LOGO')
  AND product_name IS NOT NULL 
  AND product_name != ''
  AND model_number IS NOT NULL 
  AND model_number != ''
ORDER BY model_number, shipment_date DESC
ON CONFLICT (model_number) DO NOTHING;

-- 추출된 매핑 수 확인
SELECT COUNT(*) as mapping_count FROM model_product_mapping;
