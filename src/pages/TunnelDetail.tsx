import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, RefreshCw, Trash2, Clock } from 'lucide-react';
import { useTunnels } from '../context/TunnelContext';
import TunnelForm from '../components/TunnelForm';
import StatusBadge from '../components/StatusBadge';
import { formatUptime } from '../utils/healthCheck';
import Loader from '../components/Loader';

const TunnelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tunnels, deleteTunnel, triggerRecovery } = useTunnels();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const tunnel = tunnels.find(t => t.id === id);
  
  useEffect(() => {
    if (!tunnel && tunnels.length > 0) {
      navigate('/');
    }
  }, [tunnel, tunnels, navigate]);
  
  if (!tunnel) {
    return <Loader message="Loading tunnel details..." />;
  }
  
  const lastUpdated = new Date(tunnel.last_updated);
  
  const handleDelete = async () => {
    await deleteTunnel(tunnel.id);
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Dashboard
      </button>
      
      {isEditing ? (
        <TunnelForm
          onClose={() => setIsEditing(false)}
          initialData={{
            server_name: tunnel.server_name,
            tunnel_url: tunnel.tunnel_url,
            enable_url: tunnel.enable_url,
            cloudflare_tunnel_id: tunnel.cloudflare_tunnel_id
          }}
          tunnelId={tunnel.id}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{tunnel.server_name}</h1>
                <div className="flex items-center">
                  <StatusBadge status={tunnel.status} />
                  <span className="ml-3 text-gray-500 flex items-center">
                    <Clock size={16} className="mr-1" />
                    Last updated: {lastUpdated.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setIsDeleting(true)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tunnel URL</h3>
                  <a
                    href={tunnel.tunnel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {tunnel.tunnel_url}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Enable URL</h3>
                  <a
                    href={tunnel.enable_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {tunnel.enable_url}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Uptime</h3>
                  <p className="text-gray-900">{formatUptime(tunnel.uptime)}</p>
                </div>

                {tunnel.cloudflare_tunnel_id && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Cloudflare Tunnel ID</h3>
                    <p className="text-gray-900 font-mono">{tunnel.cloudflare_tunnel_id}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3">Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => triggerRecovery(tunnel.id)}
                    disabled={tunnel.status === 'recovering'}
                    className={`w-full flex justify-center items-center px-4 py-2 rounded-md 
                      ${tunnel.status === 'recovering' 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'} 
                      transition-colors`}
                  >
                    <RefreshCw size={18} className={`mr-2 ${tunnel.status === 'recovering' ? 'animate-spin' : ''}`} />
                    {tunnel.status === 'recovering' ? 'Recovery in progress...' : 'Trigger Recovery'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Tunnel</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the tunnel "{tunnel.server_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TunnelDetail;