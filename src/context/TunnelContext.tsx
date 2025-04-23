import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';
import { checkTunnelHealth } from '../utils/healthCheck';
import { Tunnel, TunnelStatus } from '../types';
import { useAuth } from './AuthContext';

interface TunnelContextType {
  tunnels: Tunnel[];
  loading: boolean;
  error: string | null;
  addTunnel: (tunnel: Omit<Tunnel, 'id' | 'status' | 'uptime' | 'last_updated'>) => Promise<void>;
  updateTunnel: (id: string, data: Partial<Tunnel>) => Promise<void>;
  deleteTunnel: (id: string) => Promise<void>;
  refreshTunnels: () => Promise<void>;
  triggerRecovery: (id: string) => Promise<void>;
}

const TunnelContext = createContext<TunnelContextType | undefined>(undefined);

// Export the hook separately from the provider
export function useTunnels() {
  const context = useContext(TunnelContext);
  if (!context) {
    throw new Error('useTunnels must be used within a TunnelProvider');
  }
  return context;
}

interface TunnelProviderProps {
  children: ReactNode;
}

// Export the provider component
export function TunnelProvider({ children }: TunnelProviderProps) {
  const [tunnels, setTunnels] = useState<Tunnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTunnels = async () => {
    try {
      setLoading(true);
      
      // Only fetch if user is logged in
      if (!user) {
        setTunnels([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('tunnels')
        .select('*')
        .order('server_name');

      if (error) throw error;
      
      setTunnels(data || []);
    } catch (err: any) {
      console.error('Error fetching tunnels:', err);
      setError('Failed to fetch tunnels: ' + err.message);
      toast.error('Failed to load tunnels');
    } finally {
      setLoading(false);
    }
  };

  const updateTunnelStatus = async () => {
    if (!user) return;
    
    await Promise.all(
      tunnels.map(async (tunnel) => {
        try {
          const status = await checkTunnelHealth(tunnel.cloudflare_tunnel_id);
          const uptime = tunnel.status === 'online' ? (tunnel.uptime || 0) + 60 : 0;
          
          const { error } = await supabase
            .from('tunnels')
            .update({
              status,
              uptime: status === 'online' ? uptime : 0,
              last_updated: new Date().toISOString(),
            })
            .eq('id', tunnel.id);

          if (error) throw error;
          
          // If tunnel is down, trigger recovery if it wasn't already down
          if (status === 'offline' && tunnel.status !== 'offline') {
            triggerRecovery(tunnel.id);
          }
        } catch (err) {
          console.error(`Error updating tunnel ${tunnel.id}:`, err);
        }
      })
    );
    
    // Refresh the tunnels list after updates
    fetchTunnels();
  };

  useEffect(() => {
    if (user) {
      fetchTunnels();
      
      // Set up periodic health checks
      const intervalId = setInterval(updateTunnelStatus, 60000); // Check every minute
      
      return () => clearInterval(intervalId);
    } else {
      setTunnels([]);
      setLoading(false);
    }
  }, [user]);

  const addTunnel = async (tunnelData: Omit<Tunnel, 'id' | 'status' | 'uptime' | 'last_updated'>) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to add a tunnel');
      }
      
      const status = await checkTunnelHealth(tunnelData.cloudflare_tunnel_id);
      
      const { data, error } = await supabase
        .from('tunnels')
        .insert({
          ...tunnelData,
          status,
          uptime: 0,
          last_updated: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('Supabase error adding tunnel:', error);
        throw new Error(`Error adding tunnel: ${error.message}`);
      }
      
      setTunnels([...tunnels, data[0]]);
      toast.success('Tunnel added successfully');
    } catch (err: any) {
      console.error('Error adding tunnel:', err);
      toast.error(err.message || 'Failed to add tunnel');
      throw err;
    }
  };

  const updateTunnel = async (id: string, data: Partial<Tunnel>) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to update a tunnel');
      }
      
      const { error } = await supabase
        .from('tunnels')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      setTunnels(tunnels.map(tunnel => 
        tunnel.id === id ? { ...tunnel, ...data } : tunnel
      ));
      
      toast.success('Tunnel updated successfully');
    } catch (err: any) {
      console.error('Error updating tunnel:', err);
      toast.error(err.message || 'Failed to update tunnel');
    }
  };

  const deleteTunnel = async (id: string) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to delete a tunnel');
      }
      
      const { error } = await supabase
        .from('tunnels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTunnels(tunnels.filter(tunnel => tunnel.id !== id));
      toast.success('Tunnel deleted successfully');
    } catch (err: any) {
      console.error('Error deleting tunnel:', err);
      toast.error(err.message || 'Failed to delete tunnel');
    }
  };

  const triggerRecovery = async (id: string) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to trigger recovery');
      }
      
      const tunnel = tunnels.find(t => t.id === id);
      if (!tunnel) {
        throw new Error('Tunnel not found');
      }
      
      // Update the status to recovering
      await updateTunnel(id, { status: 'recovering' });
      
      // Simulate calling browser-use.com to open the enable URL
      // In a real implementation, you would integrate with browser-use.com API
      toast.loading(`Attempting recovery for ${tunnel.server_name}...`);
      
      // Implement the retry mechanism
      const MAX_RETRIES = 3;
      let retries = 0;
      
      const attemptRecovery = async () => {
        try {
          // Simulate calling browser-use service
          console.log(`Opening enable URL: ${tunnel.enable_url}`);
          
          // Wait for a bit to simulate recovery time
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Check if the tunnel is back online
          const status = await checkTunnelHealth(tunnel.cloudflare_tunnel_id);
          
          if (status === 'online') {
            await updateTunnel(id, { 
              status: 'online',
              last_updated: new Date().toISOString() 
            });
            toast.success(`${tunnel.server_name} recovered successfully`);
            return true;
          } else if (retries < MAX_RETRIES) {
            retries++;
            toast.loading(`Recovery attempt ${retries}/${MAX_RETRIES}...`);
            // Wait longer between retries (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 5000 * retries));
            return await attemptRecovery();
          } else {
            await updateTunnel(id, { 
              status: 'offline',
              last_updated: new Date().toISOString() 
            });
            toast.error(`Failed to recover ${tunnel.server_name} after ${MAX_RETRIES} attempts`);
            return false;
          }
        } catch (err) {
          console.error('Recovery attempt failed:', err);
          return false;
        }
      };
      
      attemptRecovery();
    } catch (err: any) {
      console.error('Error triggering recovery:', err);
      toast.error(err.message || 'Failed to trigger recovery');
    }
  };

  const refreshTunnels = async () => {
    if (!user) {
      toast.error('You must be logged in to refresh tunnels');
      return;
    }
    
    await fetchTunnels();
    toast.success('Tunnels refreshed');
  };

  const value = {
    tunnels,
    loading,
    error,
    addTunnel,
    updateTunnel,
    deleteTunnel,
    refreshTunnels,
    triggerRecovery
  };

  return (
    <TunnelContext.Provider value={value}>
      {children}
    </TunnelContext.Provider>
  );
}