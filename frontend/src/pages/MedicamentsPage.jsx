import React, { useState, useEffect } from 'react';
import { fetchMedicaments } from '../api/medicamentsApi';
import { Search, Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, PackageSearch, Filter } from 'lucide-react';

const MedicamentsPage = () => {
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadMedicaments = async () => {
            try {
                const data = await fetchMedicaments();
                setMedicaments(data);
            } catch (error) {
                console.error("Erreur de chargement", error);
            } finally {
                setLoading(false);
            }
        };
        loadMedicaments();
    }, []);

    // فلترة محلية سريعة بالاسم أو الـ DCI
    const filteredMedicaments = medicaments.filter(med => 
        med.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        med.dci?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // دالة باش تعطينا لون الأيقونة على حسب حالة الستوك
    const getStockBadge = (actuel, minimum) => {
        if (actuel === 0) {
            return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold"><AlertTriangle size={12}/> Rupture</span>;
        } else if (actuel <= minimum) {
            return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold"><AlertTriangle size={12}/> Faible</span>;
        } else {
            return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold"><CheckCircle2 size={12}/> Normal</span>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Inventaire des Médicaments</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez votre stock, les prix et les catégories.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm font-medium">
                    <Plus size={18} />
                    <span>Nouveau Médicament</span>
                </button>
            </div>

            {/* Toolbar (Search & Filter) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou DCI..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto">
                    <Filter size={18} />
                    <span>Filtres</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médicament</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix Unitaire</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center animate-pulse">
                                            <PackageSearch size={40} className="mb-3 text-gray-300" />
                                            <p>Chargement de l'inventaire...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMedicaments.length > 0 ? (
                                filteredMedicaments.map((med) => (
                                    <tr key={med.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-semibold border border-gray-200">
                                                    {med.nom.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{med.nom}</p>
                                                    <p className="text-xs text-gray-500">{med.forme} - {med.dosage}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
                                                {/* الإيلا كنتي كترجع السمية فـ API، غتبان هنا */}
                                                {med.categorie_nom || `ID: ${med.categorie}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800">{med.prix_vente} MAD</div>
                                            <div className="text-xs text-gray-500">Achat: {med.prix_achat} MAD</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="font-semibold text-gray-800">{med.stock_actuel} unités</span>
                                                {getStockBadge(med.stock_actuel, med.stock_minimum)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search size={32} className="mb-3 text-gray-300" />
                                            <p>Aucun médicament trouvé.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        Affichage de <span className="font-semibold text-gray-800">{filteredMedicaments.length}</span> médicaments
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">Précédent</button>
                        <button className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicamentsPage;