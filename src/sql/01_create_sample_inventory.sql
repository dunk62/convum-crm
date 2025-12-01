CREATE TABLE IF NOT EXISTS sample_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT,
    model_code TEXT,
    total_quantity INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add comment to the table
COMMENT ON TABLE sample_inventory IS '남부전략영업소 영업용 재고';
