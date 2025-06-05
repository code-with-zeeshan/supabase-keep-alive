const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Schedule a cron job to run every Monday and Thursday at 9:00 AM UTC
cron.schedule('0 9 * * 1,4', async () => {
  try {
    const { data, error } = await supabase
      .from('keep_alive')
      .select('id')
      .limit(1);
    if (error) {
      console.error('Error pinging Supabase:', error);
      return;
    }
    console.log('Supabase ping successful at', new Date().toISOString(), data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
});

// Keep the script running
console.log('Supabase keep-alive script started. Pinging every Monday and Thursday at 9:00 AM UTC.');