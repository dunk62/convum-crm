CREATE TABLE IF NOT EXISTS sample_rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id BIGINT REFERENCES opportunities(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES sample_inventory(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    rent_date DATE DEFAULT CURRENT_DATE,
    return_due_date DATE,
    returned_date DATE,
    status TEXT DEFAULT 'rented' CHECK (status IN ('rented', 'returned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE sample_rentals IS '영업 샘플 대여 이력';
