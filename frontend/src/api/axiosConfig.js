import axios from 'axios';

// Configuration de base d'Axios
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour gérer les erreurs globalement  
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erreur API:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;