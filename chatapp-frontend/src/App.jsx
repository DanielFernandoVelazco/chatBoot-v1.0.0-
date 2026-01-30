import React, { useState, useEffect } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import MainChat from './pages/MainChat';
import EditProfile from './pages/EditProfile'; // Importar

function App() {
    const [view, setView] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('chatUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
            setView('chat');
        } else {
            setView('login');
        }
    }, []);

    const handleRegisterSuccess = () => setView('login');

    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('chatUser', JSON.stringify(userData));
        setView('chat');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('chatUser');
        setView('login');
    };

    const handleUpdateProfile = (updatedUserData) => {
        setCurrentUser(updatedUserData);
        localStorage.setItem('chatUser', JSON.stringify(updatedUserData));
        setView('chat'); // Volver al chat
    };

    return (
        <div className="App">
            {view === 'chat' && currentUser ? (
                <MainChat
                    user={currentUser}
                    onLogout={handleLogout}
                    onEditProfile={() => setView('edit-profile')} // Pasa la función
                />
            ) : view === 'edit-profile' && currentUser ? (
                <EditProfile
                    user={currentUser}
                    onSave={handleUpdateProfile}
                />
            ) : view === 'login' ? (
                <Login onToggle={() => setView('register')} onLogin={handleLoginSuccess} />
            ) : (
                <Register onToggle={() => setView('login')} onRegisterSuccess={handleRegisterSuccess} />
            )}
        </div>
    );
}

export default App;