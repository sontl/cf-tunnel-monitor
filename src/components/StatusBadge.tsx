import React from 'react';
import { TunnelStatus } from '../types';

interface StatusBadgeProps {
  status: TunnelStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor, textColor, label;
  
  switch (status) {
    case 'online':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Online';
      break;
    case 'offline':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Offline';
      break;
    case 'recovering':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      label = 'Recovering';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = 'Unknown';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <span className={`w-2 h-2 mr-1.5 rounded-full ${status === 'recovering' ? 'animate-pulse' : ''} ${status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : status === 'recovering' ? 'bg-amber-500' : 'bg-gray-500'}`} />
      {label}
    </span>
  );
};

export default StatusBadge;