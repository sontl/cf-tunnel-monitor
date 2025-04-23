const fetch = require('node-fetch');
const { supabase } = require('./supabaseClient');
const { checkTunnelHealth } = require('./healthCheck');

/**
 * Checks all tunnels and attempts to recover any that are offline
 */
async function checkAndRecoverTunnels() {
  try {
    console.log('Starting tunnel health check...');
    
    // Fetch all tunnels from Supabase
    const { data: tunnels, error } = await supabase
      .from('tunnels')
      .select('*');
    
    if (error) {
      throw new Error(`Failed to fetch tunnels: ${error.message}`);
    }
    
    console.log(`Found ${tunnels.length} tunnels to check`);
    
    // Check each tunnel
    for (const tunnel of tunnels) {
      console.log(`Checking tunnel: ${tunnel.server_name}`);
      
      // Check tunnel health
      const status = await checkTunnelHealth(tunnel.cloudflare_tunnel_id);
      
      if (status === 'offline') {
        console.log(`Tunnel ${tunnel.server_name} is offline. Attempting recovery...`);
        
        // Update status to recovering
        await supabase
          .from('tunnels')
          .update({ status: 'recovering' })
          .eq('id', tunnel.id);
        
        // Call the automation server to open the enable URL
        const serverUrl = process.env.AUTOMATION_SERVER_URL || 'http://localhost:3001';
        const response = await fetch(`${serverUrl}/open-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: tunnel.enable_url }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to open URL: ${response.statusText}`);
        }
        
        console.log(`Recovery initiated for ${tunnel.server_name}`);
        
        // Wait for a bit to allow the tunnel to recover
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
        
        // Check if the tunnel is back online
        const newStatus = await checkTunnelHealth(tunnel.cloudflare_tunnel_id);
        
        if (newStatus === 'online') {
          console.log(`Tunnel ${tunnel.server_name} recovered successfully`);
          await supabase
            .from('tunnels')
            .update({ 
              status: 'online',
              last_updated: new Date().toISOString() 
            })
            .eq('id', tunnel.id);
        } else {
          console.log(`Tunnel ${tunnel.server_name} is still offline after recovery attempt`);
          await supabase
            .from('tunnels')
            .update({ 
              status: 'offline',
              last_updated: new Date().toISOString() 
            })
            .eq('id', tunnel.id);
        }
      } else {
        console.log(`Tunnel ${tunnel.server_name} is ${status}`);
      }
    }
    
    console.log('Tunnel health check completed');
  } catch (error) {
    console.error('Error in tunnel health check:', error);
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  checkAndRecoverTunnels();
}

module.exports = { checkAndRecoverTunnels }; 