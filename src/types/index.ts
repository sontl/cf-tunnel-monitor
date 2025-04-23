export type TunnelStatus = 'online' | 'offline' | 'recovering' | 'unknown';

export interface Tunnel {
  id: string;
  server_name: string;
  tunnel_url: string;
  enable_url: string;
  status: TunnelStatus;
  uptime: number;
  last_updated: string;
  cloudflare_tunnel_id?: string;
}

export interface TunnelHistory {
  id: string;
  tunnel_id: string;
  status: TunnelStatus;
  timestamp: string;
}

export interface StatusCount {
  status: TunnelStatus;
  count: number;
}

export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
}