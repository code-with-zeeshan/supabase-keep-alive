const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test ping on startup
async function testPing() {
  try {
    const { data, error } = await supabase
      .from('keep_alive')
      .select('id')
      .limit(1);
    if (error) {
      console.error('Test ping error:', error);
      return;
    }
    console.log('Test ping successful:', data);
  } catch (err) {
    console.error('Unexpected test ping error:', err);
  }
}
testPing();

// Schedule cron job
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

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'Script running' }));
app.listen(process.env.PORT || 3000, () => {
  console.log('Health check server running');
});

console.log('Supabase keep-alive script started. Pinging every Monday and Thursday at 9:00 AM UTC.');