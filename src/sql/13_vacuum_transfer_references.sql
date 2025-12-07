-- Create vacuum_transfer_references table
CREATE TABLE IF NOT EXISTS vacuum_transfer_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Header & Status
    customer_name TEXT,
    project_name TEXT,
    test_status TEXT DEFAULT 'pass' CHECK (test_status IN ('pass', 'fail')),
    
    -- Visual & Specs
    youtube_url TEXT,
    work_name TEXT,
    work_material TEXT,
    work_size TEXT,
    work_weight DECIMAL(10, 3),
    is_breathable BOOLEAN DEFAULT FALSE,
    surface_condition TEXT,
    
    -- System Config - Vacuum Generator
    ejector_model TEXT,
    nozzle_diameter TEXT,
    supply_pressure DECIMAL(5, 2),
    
    -- System Config - Pad
    pad_model TEXT,
    pad_material TEXT,
    pad_count INTEGER DEFAULT 1,
    pad_diameter DECIMAL(10, 2),
    
    -- Performance Metrics
    vacuum_level DECIMAL(5, 1),
    suction_flow DECIMAL(10, 2),
    response_time DECIMAL(6, 3),
    tags TEXT[] DEFAULT '{}',
    
    -- Calculated (stored for reference)
    safety_factor DECIMAL(6, 2),
    
    -- Pad Selection Criteria
    transport_mode TEXT,
    pad_shape TEXT,
    material_type TEXT,
    work_conditions TEXT[] DEFAULT '{}'
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_vacuum_transfer_references_updated_at ON vacuum_transfer_references;
CREATE TRIGGER update_vacuum_transfer_references_updated_at
    BEFORE UPDATE ON vacuum_transfer_references
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE vacuum_transfer_references ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow authenticated users full access" ON vacuum_transfer_references
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comment
COMMENT ON TABLE vacuum_transfer_references IS 'Stores vacuum transfer reference sheet data for engineering tests';
