import React from 'react';
import { useMedicaments } from '../hooks/useMedicaments';

const DashboardPage = () => {
    const { medicaments: alertes, loading } = useMedicaments(true); // كنجيبو غير اللي فيهم ألارم

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Tableau de Bord</h1>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', flex: 1 }}>
                    <h3>Alertes Stock</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d32f2f' }}>
                        {loading ? '...' : alertes.length} médicaments bas
                    </p>
                </div>
            </div>

            <h2>Médicaments à réapprovisionner</h2>
            <ul>
                {alertes.map(med => (
                    <li key={med.id} style={{ color: '#d32f2f', marginBottom: '5px' }}>
                        {med.nom} - Stock actuel: <strong>{med.stock_actuel}</strong> (Min: {med.stock_minimum})
                    </li>
                ))}
                {!loading && alertes.length === 0 && <p>Tout est sous contrôle ! ✅</p>}
            </ul>
        </div>
    );
};

export default DashboardPage;