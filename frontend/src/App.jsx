import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';
import AuthPage from './pages/AuthPage';

  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/login" element={<AuthPage />} />
        
         <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/medicaments" element={<ProtectedRoute><MedicamentsPage /></ProtectedRoute>} />
        <Route path="/ventes" element={<ProtectedRoute><VentesPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;