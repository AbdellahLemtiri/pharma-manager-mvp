import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                const data = await loginUser({ username: formData.username, password: formData.password });
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                navigate('/'); // ديه للداشبورد ملي يتلوݣا
            } else {
                await registerUser(formData);
                setIsLogin(true); // رجعو لصفحة اللوݣان ملي يكريي كونط
                alert("Compte créé avec succès ! Connectez-vous duba.");
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Une erreur est survenue.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Connexion' : 'Créer un compte'}</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" name="username" placeholder="Nom d'utilisateur" 
                    value={formData.username} onChange={handleChange} required 
                    style={{ padding: '10px' }}
                />
                {!isLogin && (
                    <input 
                        type="email" name="email" placeholder="Email (Optionnel)" 
                        value={formData.email} onChange={handleChange} 
                        style={{ padding: '10px' }}
                    />
                )}
                <input 
                    type="password" name="password" placeholder="Mot de passe" 
                    value={formData.password} onChange={handleChange} required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#2c3e50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {isLogin ? 'Se connecter' : "S'inscrire"}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: 'blue' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Pas de compte ? Inscrivez-vous." : "Déjà un compte ? Connectez-vous."}
            </p>
        </div>
    );
};

export default AuthPage;