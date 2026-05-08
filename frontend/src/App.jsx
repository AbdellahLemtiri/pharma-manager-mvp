import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';
import AuthPage from './pages/AuthPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />} />
        
         <Route path="/" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/medicaments" element={<Layout><MedicamentsPage /></Layout>} />
        <Route path="/ventes" element={<Layout><VentesPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;