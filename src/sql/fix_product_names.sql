-- 상품군이 RED, BLUE, NO LOGO인 레코드를 동일 형번의 올바른 상품군으로 업데이트

-- 1. sales_performance 테이블 업데이트
UPDATE sales_performance AS target
SET product_name = source.product_name
FROM (
    SELECT DISTINCT ON (model_number) model_number, product_name
    FROM sales_performance
    WHERE product_name NOT IN ('RED', 'BLUE', 'NO LOGO')
      AND product_name IS NOT NULL
      AND product_name != ''
      AND model_number IS NOT NULL
    ORDER BY model_number, shipment_date DESC
) AS source
WHERE target.model_number = source.model_number
  AND target.product_name IN ('RED', 'BLUE', 'NO LOGO');

-- 2. order_performance 테이블 업데이트 (sales_performance 매핑 참조)
UPDATE order_performance AS target
SET product_name = source.product_name
FROM (
    SELECT DISTINCT ON (model_number) model_number, product_name
    FROM sales_performance
    WHERE product_name NOT IN ('RED', 'BLUE', 'NO LOGO')
      AND product_name IS NOT NULL
      AND product_name != ''
      AND model_number IS NOT NULL
    ORDER BY model_number, shipment_date DESC
) AS source
WHERE target.model_number = source.model_number
  AND target.product_name IN ('RED', 'BLUE', 'NO LOGO');

-- 확인 쿼리: 아직 RED, BLUE, NO LOGO가 남아있는지 확인
SELECT 'sales_performance' as table_name, COUNT(*) as remaining_count
FROM sales_performance 
WHERE product_name IN ('RED', 'BLUE', 'NO LOGO')
UNION ALL
SELECT 'order_performance' as table_name, COUNT(*) as remaining_count
FROM order_performance 
WHERE product_name IN ('RED', 'BLUE', 'NO LOGO');
