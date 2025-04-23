/**
 * Checks the health of a tunnel by making a request to the Cloudflare API
 * @param {string} tunnelId The Cloudflare tunnel ID
 * @returns {Promise<'online'|'offline'|'unknown'>} The status of the tunnel
 */
async function checkTunnelHealth(tunnelId) {
  if (!tunnelId) {
    console.error('No Cloudflare tunnel ID provided');
    return 'unknown';
  }

  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      console.error('Missing Cloudflare configuration');
      return 'unknown';
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success && data.result ? 
      (data.result.status === 'healthy' ? 'online' : 'offline') : 
      'unknown';
  } catch (error) {
    console.error(`Health check failed for tunnel ${tunnelId}:`, error);
    return 'unknown';
  }
}

module.exports = { checkTunnelHealth }; 