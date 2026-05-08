import React from 'react';
import { useMedicaments } from '../hooks/useMedicaments';

const MedicamentsPage = () => {
    const { medicaments, loading, error } = useMedicaments();

    if (loading) return <div style={{ padding: '20px' }}>Chargement des médicaments...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Erreur : {error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Inventaire des Médicaments</h1>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nom</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Dosage</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Stock Actuel</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {medicaments.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>Aucun médicament trouvé.</td>
                        </tr>
                    ) : (
                        medicaments.map((med) => (
                            <tr key={med.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{med.nom}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{med.dosage}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    {med.stock_actuel}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    {med.stock_actuel <= med.stock_minimum ? (
                                        <span style={{ color: 'red', fontWeight: 'bold' }}>Stock Bas</span>
                                    ) : (
                                        <span style={{ color: 'green' }}>Normal</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MedicamentsPage;