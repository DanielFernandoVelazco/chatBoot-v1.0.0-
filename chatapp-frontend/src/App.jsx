import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import MainChat from './pages/MainChat';

function App() {
    const [view, setView] = useState('register'); // 'register', 'login', 'chat'
    const [currentUser, setCurrentUser] = useState(null);

    const handleRegisterSuccess = () => {
        setView('login');
    };

    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData); // Guardamos los datos del usuario que devolvió el backend
        setView('chat');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('login');
    };

    return (
        <div className="App">
            {view === 'chat' ? (
                // Si estamos en chat, pasamos el usuario y la función de logout
                <MainChat user={currentUser} onLogout={handleLogout} />
            ) : view === 'login' ? (
                // Pasamos la función para cambiar a chat al login
                <Login onToggle={() => setView('register')} onLogin={handleLoginSuccess} />
            ) : (
                // Pasamos la función para cambiar a login al registro
                <Register onToggle={() => setView('login')} onRegisterSuccess={handleRegisterSuccess} />
            )}
        </div>
    );
}

export default App;