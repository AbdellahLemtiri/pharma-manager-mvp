import React from 'react';
import { useMedicaments } from '../hooks/useMedicaments';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ArrowRight, Package, ShoppingCart, Pill, ShieldCheck } from 'lucide-react';

const DashboardPage = () => {
    const { medicaments: alertes, loading } = useMedicaments(true); 

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Tableau de Bord</h1>
                <p className="text-gray-500 mt-2">Bienvenue sur votre espace de gestion PharmaManager.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Alertes Stock */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Alertes de Stock</p>
                        <p className={`text-4xl font-bold ${alertes?.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {loading ? '...' : alertes?.length || 0}
                        </p>
                    </div>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${alertes?.length > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                        {alertes?.length > 0 ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
                    </div>
                </div>

                {/* Card 2: Raccourci Inventaire */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Gestion Rapide</p>
                        <Package size={20} className="text-gray-400 group-hover:text-secondary transition-colors" />
                    </div>
                    <Link to="/medicaments" className="text-secondary font-semibold hover:text-green-700 flex items-center gap-2">
                        <span>Aller à l'inventaire</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Card 3: Raccourci Ventes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Caisse</p>
                        <ShoppingCart size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <Link to="/ventes" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2">
                        <span>Nouvelle vente</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Table Section: Médicaments à réapprovisionner */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Médicaments à réapprovisionner (Urgent)</h2>
                </div>
                
                <div className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 animate-pulse">Chargement des données...</div>
                    ) : alertes?.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {alertes.map(med => (
                                <li key={med.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                                            <Pill size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{med.nom}</p>
                                            <p className="text-sm text-gray-500">Seuil minimum: {med.stock_minimum}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                            {med.stock_actuel} en stock
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-16 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                                <ShieldCheck size={40} />
                            </div>
                            <p className="text-gray-800 font-semibold text-xl mb-1">Tout est sous contrôle !</p>
                            <p className="text-gray-500">Aucun médicament n'est en rupture de stock pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;