import React, { useState, useEffect } from 'react'; // Agregar useEffect
import Register from './pages/Register';
import Login from './pages/Login';
import MainChat from './pages/MainChat';

function App() {
    const [view, setView] = useState('register');
    const [currentUser, setCurrentUser] = useState(null);

    // 1. AL CARGAR LA APP: Verificar si hay usuario guardado
    useEffect(() => {
        const savedUser = localStorage.getItem('chatUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
            setView('chat');
        } else {
            setView('login'); // Si no hay usuario, ir al login por defecto
        }
    }, []);

    const handleRegisterSuccess = () => {
        setView('login');
    };

    const handleLoginSuccess = (userData) => {
        // 2. AL LOGUEAR: Guardar usuario en memoria y en localStorage
        setCurrentUser(userData);
        localStorage.setItem('chatUser', JSON.stringify(userData));
        setView('chat');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('chatUser'); // Borrar del navegador
        setView('login');
    };

    return (
        <div className="App">
            {view === 'chat' && currentUser ? (
                // Solo mostramos chat si existe el usuario
                <MainChat user={currentUser} onLogout={handleLogout} />
            ) : view === 'login' ? (
                <Login onToggle={() => setView('register')} onLogin={handleLoginSuccess} />
            ) : (
                <Register onToggle={() => setView('login')} onRegisterSuccess={handleRegisterSuccess} />
            )}
        </div>
    );
}

export default App;