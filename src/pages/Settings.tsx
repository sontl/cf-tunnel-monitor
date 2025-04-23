import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    checkInterval: 60,
    maxRetries: 3,
    retryDelay: 5,
    notifications: {
      email: false,
      emailAddress: '',
      webhook: false,
      webhookUrl: ''
    }
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Monitoring Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="checkInterval" className="block text-sm font-medium text-gray-700 mb-1">
                  Check Interval (seconds)
                </label>
                <input
                  type="number"
                  id="checkInterval"
                  name="checkInterval"
                  min="10"
                  value={settings.checkInterval}
                  onChange={handleChange}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="maxRetries" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Retry Attempts
                </label>
                <input
                  type="number"
                  id="maxRetries"
                  name="maxRetries"
                  min="1"
                  max="10"
                  value={settings.maxRetries}
                  onChange={handleChange}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="retryDelay" className="block text-sm font-medium text-gray-700 mb-1">
                  Retry Delay (minutes)
                </label>
                <input
                  type="number"
                  id="retryDelay"
                  name="retryDelay"
                  min="1"
                  value={settings.retryDelay}
                  onChange={handleChange}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="email"
                    name="notifications.email"
                    checked={settings.notifications.email}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email" className="ml-2 block text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                </div>
                
                {settings.notifications.email && (
                  <div className="ml-6">
                    <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="emailAddress"
                      name="notifications.emailAddress"
                      value={settings.notifications.emailAddress}
                      onChange={handleChange}
                      className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="webhook"
                    name="notifications.webhook"
                    checked={settings.notifications.webhook}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="webhook" className="ml-2 block text-sm font-medium text-gray-700">
                    Webhook Notifications
                  </label>
                </div>
                
                {settings.notifications.webhook && (
                  <div className="ml-6">
                    <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      id="webhookUrl"
                      name="notifications.webhookUrl"
                      value={settings.notifications.webhookUrl}
                      onChange={handleChange}
                      className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;