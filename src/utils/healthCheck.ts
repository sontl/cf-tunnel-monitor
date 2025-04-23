import { TunnelStatus, CloudflareConfig } from '../types';

const getCloudflareConfig = (): CloudflareConfig | null => {
  const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
  const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.error('Missing Cloudflare configuration');
    return null;
  }

  return { accountId, apiToken };
};

/**
 * Checks the health of a tunnel by making a request to Cloudflare API
 * @param tunnelId The Cloudflare tunnel ID
 * @returns The status of the tunnel (online, offline)
 */
export const checkTunnelHealth = async (tunnelId?: string): Promise<TunnelStatus> => {
  if (!tunnelId) {
    console.error('No Cloudflare tunnel ID provided');
    return 'unknown';
  }
  console.log("checking health for tunnel " + tunnelId);
  const config = getCloudflareConfig();
  console.log("Config: ", config);
  if (!config) {
    return 'unknown';
  }
  
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/cfd_tunnel/${tunnelId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check the tunnel status from the Cloudflare API response
    // You might need to adjust this based on the actual response structure
    console.log(data.result);
    if (data.success && data.result) {
      const status = data.result.status;
      return status === 'healthy' ? 'online' : 'offline';
    }

    return 'unknown';
  } catch (error) {
    console.error(`Health check failed for tunnel ${tunnelId}:`, error);
    return 'offline';
  }
};

/**
 * Calculates uptime percentage based on history
 * @param uptime The uptime in seconds
 * @param since The time since monitoring began
 * @returns Uptime percentage
 */
export const calculateUptimePercentage = (uptime: number, since: Date): number => {
  const now = new Date();
  const totalTime = (now.getTime() - since.getTime()) / 1000; // convert to seconds
  
  if (totalTime <= 0) return 100; // Avoid division by zero
  
  const percentage = (uptime / totalTime) * 100;
  return Math.min(100, Math.max(0, percentage)); // Ensure between 0-100
};

/**
 * Formats uptime in a human-readable format
 * @param seconds Uptime in seconds
 * @returns Formatted uptime string
 */
export const formatUptime = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''}`;
};