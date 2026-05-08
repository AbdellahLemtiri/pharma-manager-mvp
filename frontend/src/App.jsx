import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';

function App() {
  return (
    <Router>
      <nav style={{ padding: '20px', background: '#2c3e50', color: 'white', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/medicaments" style={{ color: 'white', textDecoration: 'none' }}>Inventaire</Link>
        <Link to="/ventes" style={{ color: 'white', textDecoration: 'none' }}>Ventes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/medicaments" element={<MedicamentsPage />} />
        <Route path="/ventes" element={<VentesPage />} />
      </Routes>
    </Router>
  );
}

export default App;