import { useState, useEffect } from 'react';
import { fetchMedicaments, fetchAlertes } from '../api/medicamentsApi';

export const useMedicaments = (onlyAlertes = false) => {
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Si on veut juste les alertes, on appelle fetchAlertes, sinon fetchMedicaments
                const data = onlyAlertes ? await fetchAlertes() : await fetchMedicaments();
                setMedicaments(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Une erreur est survenue lors du chargement.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [onlyAlertes]);

    return { medicaments, loading, error };
};