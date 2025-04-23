import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import TunnelDetail from './pages/TunnelDetail';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Login from './pages/Login';
import { TunnelProvider } from './context/TunnelContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import Loader from './components/Loader';

// Private route wrapper
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loader message="Authenticating..." />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message="Loading..." />;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/tunnel/:id" element={
        <PrivateRoute>
          <Layout>
            <TunnelDetail />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/settings" element={
        <PrivateRoute>
          <Layout>
            <Settings />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <TunnelProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-right" />
        </Router>
      </TunnelProvider>
    </AuthProvider>
  );
}

export default App;