import React from 'react';
import { Clock, RefreshCw, Server, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tunnel } from '../types';
import { useTunnels } from '../context/TunnelContext';
import { formatUptime } from '../utils/healthCheck';
import StatusBadge from './StatusBadge';

interface TunnelCardProps {
  tunnel: Tunnel;
}

const TunnelCard: React.FC<TunnelCardProps> = ({ tunnel }) => {
  const { triggerRecovery } = useTunnels();
  const lastUpdated = new Date(tunnel.last_updated);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Server className="text-gray-500 mr-2" size={20} />
            <h3 className="font-medium text-lg text-gray-900 truncate">
              {tunnel.server_name}
            </h3>
          </div>
          <StatusBadge status={tunnel.status} />
        </div>
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <ExternalLink size={16} className="mr-2" />
            <a 
              href={tunnel.tunnel_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {tunnel.tunnel_url}
            </a>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>Uptime: {formatUptime(tunnel.uptime)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <RefreshCw size={16} className="mr-2" />
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between">
        <Link 
          to={`/tunnel/${tunnel.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </Link>
        
        {tunnel.status === 'offline' && (
          <button
            onClick={() => triggerRecovery(tunnel.id)}
            className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors flex items-center"
          >
            <AlertCircle size={14} className="mr-1" />
            Recover
          </button>
        )}
      </div>
    </div>
  );
};

export default TunnelCard;