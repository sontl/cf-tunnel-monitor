import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Settings, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="bg-blue-600 text-white p-1.5 rounded mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M21.17 8H12V4" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-xl">TunnelMonitor</span>
          </Link>
          
          {/* User info and mobile menu button */}
          <div className="flex items-center">
            {user && (
              <div className="hidden md:flex items-center mr-4">
                <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-700 max-w-[150px] truncate">
                  {user.email}
                </span>
              </div>
            )}
            
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleMenu}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <LayoutGrid size={18} className="mr-1.5" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/settings') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <Settings size={18} className="mr-1.5" />
                Settings
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <LogOut size={18} className="mr-1.5" />
                Sign Out
              </div>
            </button>
          </nav>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
            {user && (
              <div className="flex items-center py-2 mb-2 border-b border-gray-100">
                <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-700 max-w-[220px] truncate">
                  {user.email}
                </span>
              </div>
            )}
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center">
                  <LayoutGrid size={18} className="mr-1.5" />
                  Dashboard
                </div>
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/settings') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Settings size={18} className="mr-1.5" />
                  Settings
                </div>
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 text-left"
              >
                <div className="flex items-center">
                  <LogOut size={18} className="mr-1.5" />
                  Sign Out
                </div>
              </button>
            </nav>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Tunnel Monitor. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;