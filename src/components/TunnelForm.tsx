import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTunnels } from '../context/TunnelContext';

interface TunnelFormProps {
  onClose: () => void;
  initialData?: {
    server_name: string;
    tunnel_url: string;
    enable_url: string;
    cloudflare_tunnel_id?: string;
  };
  tunnelId?: string;
}

const TunnelForm: React.FC<TunnelFormProps> = ({ 
  onClose, 
  initialData,
  tunnelId 
}) => {
  const { addTunnel, updateTunnel } = useTunnels();
  const [formData, setFormData] = useState({
    server_name: initialData?.server_name || '',
    tunnel_url: initialData?.tunnel_url || '',
    enable_url: initialData?.enable_url || '',
    cloudflare_tunnel_id: initialData?.cloudflare_tunnel_id || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.server_name.trim()) {
      newErrors.server_name = 'Server name is required';
    }
    
    if (!formData.tunnel_url.trim()) {
      newErrors.tunnel_url = 'Tunnel URL is required';
    } else if (!isValidUrl(formData.tunnel_url)) {
      newErrors.tunnel_url = 'Please enter a valid URL';
    }
    
    if (!formData.enable_url.trim()) {
      newErrors.enable_url = 'Enable URL is required';
    } else if (!isValidUrl(formData.enable_url)) {
      newErrors.enable_url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (tunnelId) {
        await updateTunnel(tunnelId, formData);
      } else {
        await addTunnel(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {tunnelId ? 'Edit Tunnel' : 'Add New Tunnel'}
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="server_name" className="block text-sm font-medium text-gray-700 mb-1">
              Server Name
            </label>
            <input
              type="text"
              id="server_name"
              name="server_name"
              value={formData.server_name}
              onChange={handleChange}
              placeholder="e.g., idx1.myserver.com"
              className={`w-full px-3 py-2 border ${errors.server_name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.server_name && (
              <p className="mt-1 text-sm text-red-600">{errors.server_name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="tunnel_url" className="block text-sm font-medium text-gray-700 mb-1">
              Tunnel URL
            </label>
            <input
              type="text"
              id="tunnel_url"
              name="tunnel_url"
              value={formData.tunnel_url}
              onChange={handleChange}
              placeholder="https://tunnel.example.com"
              className={`w-full px-3 py-2 border ${errors.tunnel_url ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.tunnel_url && (
              <p className="mt-1 text-sm text-red-600">{errors.tunnel_url}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="enable_url" className="block text-sm font-medium text-gray-700 mb-1">
              Enable URL
            </label>
            <input
              type="text"
              id="enable_url"
              name="enable_url"
              value={formData.enable_url}
              onChange={handleChange}
              placeholder="https://enable.example.com"
              className={`w-full px-3 py-2 border ${errors.enable_url ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.enable_url && (
              <p className="mt-1 text-sm text-red-600">{errors.enable_url}</p>
            )}
          </div>

          <div>
            <label htmlFor="cloudflare_tunnel_id" className="block text-sm font-medium text-gray-700 mb-1">
              Cloudflare Tunnel ID
            </label>
            <input
              type="text"
              id="cloudflare_tunnel_id"
              name="cloudflare_tunnel_id"
              value={formData.cloudflare_tunnel_id}
              onChange={handleChange}
              placeholder="Optional: Enter your Cloudflare tunnel ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              The tunnel ID from your Cloudflare dashboard for accurate health checks
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : tunnelId ? 'Update Tunnel' : 'Add Tunnel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TunnelForm;