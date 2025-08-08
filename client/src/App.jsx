import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('login');

  if (isAuthenticated) {
    return <Dashboard onLogout={logout} />;
  }

  switch (currentPage) {
    case 'register':
      return <Register onSwitchToLogin={() => setCurrentPage('login')} />;
    default:
      return <Login onSwitchToRegister={() => setCurrentPage('register')} />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;