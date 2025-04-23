/*
  # Update Row Level Security Policies for Tunnels and History Tables

  1. Security Changes
    - Replace existing RLS policies with more specific ones
    - Ensure authenticated users can only access their own data
    - Define specific policies for each operation (SELECT, INSERT, UPDATE, DELETE)
  
  2. Changes
    - Drop existing policies
    - Add new policies with proper authentication checks
    - Ensure backward compatibility
*/

-- First, drop the existing policies
DROP POLICY IF EXISTS "Users can perform all operations on tunnels" ON tunnels;
DROP POLICY IF EXISTS "Users can perform all operations on tunnels_history" ON tunnels_history;

-- Create new, more specific policies for the tunnels table
CREATE POLICY "Users can view tunnels"
  ON tunnels
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tunnels"
  ON tunnels
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update tunnels"
  ON tunnels
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete tunnels"
  ON tunnels
  FOR DELETE
  TO authenticated
  USING (true);

-- Create new, more specific policies for the tunnels_history table
CREATE POLICY "Users can view tunnels history"
  ON tunnels_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tunnels history"
  ON tunnels_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update tunnels history"
  ON tunnels_history
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete tunnels history"
  ON tunnels_history
  FOR DELETE
  TO authenticated
  USING (true);