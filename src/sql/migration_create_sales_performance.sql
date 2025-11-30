-- Create sales_performance table
CREATE TABLE IF NOT EXISTS sales_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_date TIMESTAMP WITH TIME ZONE, -- 출고일
    distributor_name TEXT, -- 판매점명
    company_name TEXT, -- 업체명
    sales_rep TEXT, -- 영업담당자
    product_name TEXT, -- 판매상품
    model_number TEXT, -- 형번
    quantity INTEGER, -- 수량
    unit_price NUMERIC, -- 단가
    sales_amount NUMERIC, -- 판매금액
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comment to table
COMMENT ON TABLE sales_performance IS 'Sales performance data imported from Excel';

-- Add indexes for common search/filter columns
CREATE INDEX IF NOT EXISTS idx_sales_performance_shipment_date ON sales_performance(shipment_date);
CREATE INDEX IF NOT EXISTS idx_sales_performance_company_name ON sales_performance(company_name);
CREATE INDEX IF NOT EXISTS idx_sales_performance_sales_rep ON sales_performance(sales_rep);

-- Enable Row Level Security (RLS)
ALTER TABLE sales_performance ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view all data
CREATE POLICY "Enable read access for all users" ON sales_performance
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert data
CREATE POLICY "Enable insert access for all users" ON sales_performance
    FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to update data
CREATE POLICY "Enable update access for all users" ON sales_performance
    FOR UPDATE USING (true);

-- Create policy to allow authenticated users to delete data
CREATE POLICY "Enable delete access for all users" ON sales_performance
    FOR DELETE USING (true);
