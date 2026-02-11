import React, { useState, useEffect } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import MainChat from './pages/MainChat';
import EditProfile from './pages/EditProfile';
import AccountSettings from './pages/AccountSettings';
import PrivacySecurity from './pages/PrivacySecurity';
import NotificationsSettings from './pages/NotificationsSettings';
import HelpSupport from './pages/HelpSupport';

function App() {
    const [view, setView] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);

    // 1. Cargar sesión al iniciar la App
    useEffect(() => {
        const savedUser = localStorage.getItem('chatUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
            setView('chat');
        } else {
            setView('login');
        }
    }, []);

    const handleRegisterSuccess = () => {
        setView('login');
    };

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
        setView('chat');
    };

    return (
        <div className="App">
            {view === 'chat' && currentUser ? (
                <MainChat
                    user={currentUser}
                    onLogout={handleLogout}
                    onEditProfile={() => setView('edit-profile')}
                    onAccountSettings={() => setView('account-settings')}
                    onHelp={() => setView('help')}
                />
            ) : view === 'edit-profile' && currentUser ? (
                <EditProfile
                    user={currentUser}
                    onSave={handleUpdateProfile}
                    onAccountSettings={() => setView('account-settings')}
                    onBack={() => setView('chat')}
                />
            ) : view === 'account-settings' && currentUser ? (
                <AccountSettings
                    user={currentUser}
                    onBack={() => setView('edit-profile')}
                    onPrivacy={() => setView('privacy-security')}
                />
            ) : view === 'privacy-security' && currentUser ? (
                <PrivacySecurity
                    user={currentUser}
                    onBack={() => setView('account-settings')}
                    onNotifications={() => setView('notifications-settings')}
                />
            ) : view === 'notifications-settings' && currentUser ? (
                <NotificationsSettings
                    user={currentUser}
                    onBack={() => setView('privacy-security')}
                />
            ) : view === 'help' && currentUser ? (
                <HelpSupport
                    user={currentUser}
                    onBack={() => setView('chat')}
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