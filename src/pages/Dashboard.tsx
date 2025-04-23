import React, { useState } from 'react';
import { Plus, RotateCw } from 'lucide-react';
import { useTunnels } from '../context/TunnelContext';
import TunnelCard from '../components/TunnelCard';
import TunnelForm from '../components/TunnelForm';
import StatusSummary from '../components/StatusSummary';
import Loader from '../components/Loader';

const Dashboard: React.FC = () => {
  const { tunnels, loading, error, refreshTunnels } = useTunnels();
  const [isAddingTunnel, setIsAddingTunnel] = useState(false);

  if (loading && tunnels.length === 0) {
    return <Loader message="Loading tunnels..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tunnel Monitor</h1>
          <p className="text-gray-600">
            Monitor and manage your CloudFlare tunnels
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => refreshTunnels()}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
          >
            <RotateCw size={18} className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setIsAddingTunnel(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Tunnel
          </button>
        </div>
      </div>

      {/* Status summary */}
      <StatusSummary tunnels={tunnels} />

      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Add tunnel form */}
      {isAddingTunnel && (
        <div className="mb-6">
          <TunnelForm onClose={() => setIsAddingTunnel(false)} />
        </div>
      )}

      {/* Tunnels grid */}
      {tunnels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tunnels.map((tunnel) => (
            <TunnelCard key={tunnel.id} tunnel={tunnel} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No tunnels found</h3>
          <p className="text-gray-500 mb-4">
            Add your first tunnel to start monitoring
          </p>
          <button
            onClick={() => setIsAddingTunnel(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Add Tunnel
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;