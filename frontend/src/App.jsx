import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';
import AuthPage from './pages/AuthPage';


const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };
    return <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Déconnexion</button>;
};

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
      <nav style={{ padding: '20px', background: '#2c3e50', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/medicaments" style={{ color: 'white', textDecoration: 'none' }}>Inventaire</Link>
        <Link to="/ventes" style={{ color: 'white', textDecoration: 'none' }}>Ventes</Link>
        {isAuthenticated ? <LogoutButton /> : <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: 'auto' }}>Login</Link>}
      </nav>

      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/medicaments" element={<MedicamentsPage />} />
        <Route path="/ventes" element={<VentesPage />} />
      </Routes>
    </Router>
  );
}

export default App;