
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugOpportunities() {
    const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching opportunities:', error);
        return;
    }

    console.log('Opportunities Data Sample:', data);

    if (data && data.length > 0) {
        console.log('First item keys:', Object.keys(data[0]));
        console.log('expected_revenue type:', typeof data[0].expected_revenue);
        console.log('expected_revenue value:', data[0].expected_revenue);
    } else {
        console.log('No data found in opportunities table.');
    }
}

debugOpportunities();
