/*
  # Create tunnels table

  1. New Tables
    - `tunnels`
      - `id` (uuid, primary key)
      - `server_name` (text, not null)
      - `tunnel_url` (text, not null)
      - `enable_url` (text, not null)
      - `status` (text, not null, default: 'unknown')
      - `uptime` (integer, default: 0)
      - `last_updated` (timestamptz, default: now())
      - `created_at` (timestamptz, default: now())
  
  2. Security
    - Enable RLS on `tunnels` table
    - Add policy for authenticated users to perform all operations
*/

-- Create tunnels table
CREATE TABLE IF NOT EXISTS tunnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_name text NOT NULL,
  tunnel_url text NOT NULL,
  enable_url text NOT NULL,
  status text NOT NULL DEFAULT 'unknown',
  uptime integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create tunnels_history table to track status changes
CREATE TABLE IF NOT EXISTS tunnels_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tunnel_id uuid REFERENCES tunnels(id) ON DELETE CASCADE,
  status text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create index on tunnel_id for performance
CREATE INDEX IF NOT EXISTS tunnels_history_tunnel_id_idx ON tunnels_history(tunnel_id);

-- Enable Row Level Security
ALTER TABLE tunnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tunnels_history ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can perform all operations on tunnels"
  ON tunnels
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can perform all operations on tunnels_history"
  ON tunnels_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to record history when tunnel status changes
CREATE OR REPLACE FUNCTION record_tunnel_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status <> OLD.status THEN
    INSERT INTO tunnels_history (tunnel_id, status)
    VALUES (NEW.id, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to record status changes
CREATE TRIGGER tunnel_status_change
AFTER INSERT OR UPDATE ON tunnels
FOR EACH ROW
EXECUTE FUNCTION record_tunnel_status_change();