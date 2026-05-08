import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/medicaments', label: 'Inventaire', icon: '💊' },
        { path: '/ventes', label: 'Ventes', icon: '🛒' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-secondary tracking-wider">PharmaManager</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                location.pathname === link.path 
                                ? 'bg-secondary text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
                {isAuthenticated && (
                    <div className="p-4 border-t border-gray-700">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Topbar */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {navLinks.find(l => l.path === location.pathname)?.label || 'PharmaManager'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                            A
                        </span>
                    </div>
                </header>

                 <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;