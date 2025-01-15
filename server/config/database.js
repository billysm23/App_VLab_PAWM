const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
require('dotenv').config({ path: envPath });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        },
        db: {
            schema: 'public'
        }
    }
);

// Test connection
const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) throw error;
        console.log('Supabase connection successful');
    } catch (error) {
        console.error('Supabase connection failed:', error.message);
        throw error;
    }
};

testConnection();

module.exports = supabase;