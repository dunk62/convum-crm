CREATE OR REPLACE VIEW inventory_status_view AS
SELECT 
    i.id,
    i.product_name,
    i.model_code,
    i.total_quantity,
    i.description,
    COALESCE(SUM(r.quantity) FILTER (WHERE r.status = 'rented'), 0) as rented_quantity,
    (i.total_quantity - COALESCE(SUM(r.quantity) FILTER (WHERE r.status = 'rented'), 0)) as available_quantity
FROM 
    sample_inventory i
LEFT JOIN 
    sample_rentals r ON i.id = r.inventory_id
GROUP BY 
    i.id, i.product_name, i.model_code, i.total_quantity, i.description;

COMMENT ON VIEW inventory_status_view IS '재고 현황 및 가용 재고 계산 뷰';
