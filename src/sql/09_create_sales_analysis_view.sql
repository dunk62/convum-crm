CREATE OR REPLACE VIEW distributor_yearly_sales AS
SELECT
    distributor_name,
    EXTRACT(YEAR FROM shipment_date) as year,
    SUM(sales_amount) as total_sales
FROM
    sales_performance
GROUP BY
    distributor_name,
    EXTRACT(YEAR FROM shipment_date);
