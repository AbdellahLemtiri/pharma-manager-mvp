import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, ShoppingBag, LogOut,Pill, UserCircle } from 'lucide-react';

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
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/medicaments', label: 'Inventaire', icon: <PackageSearch size={20} /> },
        { path: '/ventes', label: 'Ventes', icon: <ShoppingBag size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                        <Pill size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-wider">Pharma<span className="text-secondary">Manager</span></h1>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                location.pathname === link.path 
                                ? 'bg-secondary text-white shadow-md' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {link.icon}
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                {isAuthenticated && (
                    <div className="p-4 border-t border-gray-800">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-gray-400 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Déconnexion</span>
                        </button>
                    </div>
                )}
            </aside>

             <main className="flex-1 flex flex-col overflow-hidden">
                 <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {navLinks.find(l => l.path === location.pathname)?.label || 'Espace de Gestion'}
                    </h2>
                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                        <UserCircle size={24} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Admin</span>
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