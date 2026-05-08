import React, { useState, useEffect } from 'react';
import { fetchVentes, annulerVente } from '../api/ventesApi';
import { fetchMedicaments } from '../api/medicamentsApi';
import axiosInstance from '../api/axiosConfig';
import { Search, Plus, Filter, ShoppingCart, XCircle, CheckCircle2, ReceiptText, AlertCircle, X } from 'lucide-react';

const VentesPage = () => {
    // States ديال المبيعات
    const [ventes, setVentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
     const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicaments, setMedicaments] = useState([]);
    const [newVente, setNewVente] = useState({ medicament: '', quantite: 1 });
    const [submitLoading, setSubmitLoading] = useState(false);

     const loadVentes = async () => {
        setLoading(true);
        try {
            const data = await fetchVentes();
            setVentes(data);
        } catch (error) {
            console.error("Erreur de chargement des ventes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVentes();
    }, []);

     const handleOpenModal = async () => {
        try {
            const meds = await fetchMedicaments();
            setMedicaments(meds);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Erreur chargement médicaments", error);
            alert("Impossible de charger les médicaments.");
        }
    };

     const handleCreateVente = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await axiosInstance.post('/ventes/', {
                lignes: [{ 
                    medicament: parseInt(newVente.medicament), 
                    quantite: parseInt(newVente.quantite) 
                }]
            });
            setIsModalOpen(false);
            setNewVente({ medicament: '', quantite: 1 });
            loadVentes();  
        } catch (error) {
            alert(error.response?.data?.error || "Erreur lors de la création de la vente.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // إلغاء بيعة
    const handleAnnulerVente = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler cette vente ? Le stock sera réintégré.")) {
            try {
                await annulerVente(id);
                loadVentes(); 
            } catch (error) {
                alert("Erreur lors de l'annulation de la vente.");
            }
        }
    };

    // فلترة محلية بالـ Référence
    const filteredVentes = ventes.filter(vente => 
        vente.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatutBadge = (statut) => {
        if (statut === 'Annulée') {
            return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold"><XCircle size={12}/> Annulée</span>;
        }
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold"><CheckCircle2 size={12}/> Complétée</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Historique des Ventes</h1>
                    <p className="text-sm text-gray-500 mt-1">Suivez vos transactions et gérez les annulations.</p>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} />
                    <span>Nouvelle Vente</span>
                </button>
            </div>

            {/* Modal de création de vente */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart size={24} className="text-blue-600"/> 
                                Nouvelle Vente
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateVente} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Médicament</label>
                                <select 
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                                    value={newVente.medicament}
                                    onChange={e => setNewVente({...newVente, medicament: e.target.value})}
                                    required
                                >
                                    <option value="" disabled>Sélectionner un médicament</option>
                                    {medicaments.filter(m => m.stock_actuel > 0).map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.nom} ({m.stock_actuel} en stock) - {m.prix_vente} MAD
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    required
                                    placeholder="Ex: 2" 
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={newVente.quantite}
                                    onChange={e => setNewVente({...newVente, quantite: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitLoading || !newVente.medicament}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {submitLoading ? 'Validation en cours...' : 'Valider la vente'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Rechercher par référence..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Référence</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total TTC</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center animate-pulse">
                                            <ShoppingCart size={40} className="mb-3 text-gray-300" />
                                            <p>Chargement des ventes...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredVentes.length > 0 ? (
                                filteredVentes.map((vente) => (
                                    <tr key={vente.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold border border-blue-100">
                                                    <ReceiptText size={20} />
                                                </div>
                                                <span className="font-semibold text-gray-800">{vente.reference}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(vente.date_vente).toLocaleString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-800 text-lg">{vente.total_ttc} MAD</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatutBadge(vente.statut)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {vente.statut !== 'Annulée' && (
                                                    <button 
                                                        onClick={() => handleAnnulerVente(vente.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        <XCircle size={16} />
                                                        Annuler
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Détails">
                                                    <AlertCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <ReceiptText size={32} className="mb-3 text-gray-300" />
                                            <p>Aucune vente trouvée.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VentesPage;