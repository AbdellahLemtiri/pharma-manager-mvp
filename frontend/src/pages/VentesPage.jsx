import React, { useState, useEffect } from 'react';
import { fetchVentes } from '../api/ventesApi';

const VentesPage = () => {
    const [ventes, setVentes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVentes = async () => {
            try {
                const data = await fetchVentes();
                setVentes(data);
            } catch (error) {
                console.error("Erreur de chargement des ventes", error);
            } finally {
                setLoading(false);
            }
        };
        loadVentes();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Chargement des ventes...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Historique des Ventes</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Référence</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Date</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total TTC</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {ventes.map((vente) => (
                        <tr key={vente.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{vente.reference}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{new Date(vente.date_vente).toLocaleDateString()}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{vente.total_ttc} MAD</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{vente.statut}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VentesPage;