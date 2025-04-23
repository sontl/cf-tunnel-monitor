/*
  # Add Cloudflare tunnel ID to tunnels table

  1. Changes
    - Add cloudflare_tunnel_id column to tunnels table
    
  2. Notes
    - This column is optional to maintain backward compatibility
    - Will be used to store the Cloudflare tunnel ID for health checks
*/

ALTER TABLE tunnels
ADD COLUMN IF NOT EXISTS cloudflare_tunnel_id text;