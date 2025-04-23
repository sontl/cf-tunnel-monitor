import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Tunnel, StatusCount } from '../types';

interface StatusSummaryProps {
  tunnels: Tunnel[];
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ tunnels }) => {
  const statusCounts: StatusCount[] = useMemo(() => {
    const counts: Record<string, number> = {
      online: 0,
      offline: 0,
      recovering: 0,
      unknown: 0
    };
    
    tunnels.forEach(tunnel => {
      counts[tunnel.status] = (counts[tunnel.status] || 0) + 1;
    });
    
    return Object.entries(counts).map(([status, count]) => ({
      status: status as any,
      count
    }));
  }, [tunnels]);
  
  if (tunnels.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statusCounts.map(item => (
        <div key={item.status} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            {item.status === 'online' && (
              <CheckCircle className="text-green-500 mr-3" size={24} />
            )}
            {item.status === 'offline' && (
              <AlertCircle className="text-red-500 mr-3" size={24} />
            )}
            {item.status === 'recovering' && (
              <RefreshCw className="text-amber-500 mr-3 animate-spin" size={24} />
            )}
            {item.status === 'unknown' && (
              <AlertTriangle className="text-gray-500 mr-3" size={24} />
            )}
            <div>
              <p className="text-sm text-gray-500 capitalize">{item.status}</p>
              <p className="text-2xl font-bold">
                {item.count}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusSummary;