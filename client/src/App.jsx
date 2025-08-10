import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = React.useState('login'); // 'login', 'register', 'dashboard', 'admin'

  // Jika sudah login, tentukan antara dashboard atau admin panel
  if (isAuthenticated) {
    if (currentView === 'admin') {
      return <AdminDashboard onNavigateToDashboard={() => setCurrentView('dashboard')} />;
    }
    // Default view setelah login adalah dashboard
    return <Dashboard onNavigateToAdmin={() => setCurrentView('admin')} />;
  }
  
  // Jika belum login, tampilkan login atau register
  switch (currentView) {
    case 'register':
      return <Register onSwitchToLogin={() => setCurrentView('login')} />;
    default:
      return <Login onLoginSuccess={() => setCurrentView('dashboard')} onSwitchToRegister={() => setCurrentView('register')} />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppContent />
    </AuthProvider>
  );
};

export default App;