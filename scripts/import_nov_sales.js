import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importSales() {
    const jsonPath = path.join(__dirname, '../src/data/nov_sales.json');

    if (!fs.existsSync(jsonPath)) {
        console.error(`File not found: ${jsonPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const records = JSON.parse(rawData);

    console.log(`Found ${records.length} records to import.`);

    // Delete existing records for November 2025 to avoid duplicates
    console.log('Deleting existing November 2025 records...');
    const { error: deleteError } = await supabase
        .from('sales_performance')
        .delete()
        .gte('shipment_date', '2025-11-01')
        .lte('shipment_date', '2025-11-30');

    if (deleteError) {
        console.error('Error deleting existing records:', deleteError);
        return;
    }
    console.log('Existing records deleted.');

    const chunkSize = 100;
    for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);

        const { error } = await supabase
            .from('sales_performance')
            .insert(chunk);

        if (error) {
            console.error(`Error inserting chunk ${i / chunkSize + 1}:`, error);
        } else {
            console.log(`Inserted records ${i + 1} to ${Math.min(i + chunkSize, records.length)}`);
        }
    }

    console.log('Import completed.');
}

importSales();
