import { TunnelStatus } from '../types';

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

/**
 * Checks the health of a tunnel by making a request to our Edge Function
 * @param tunnelId The Cloudflare tunnel ID
 * @returns The status of the tunnel (online, offline, unknown)
 */
export const checkTunnelHealth = async (tunnelId?: string): Promise<TunnelStatus> => {
  if (!tunnelId) {
    console.error('No Cloudflare tunnel ID provided');
    return 'unknown';
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-tunnel-health?tunnelId=${tunnelId}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error(`Health check failed for tunnel ${tunnelId}:`, error);
    return 'unknown';
  }
};