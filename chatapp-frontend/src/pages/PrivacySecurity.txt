import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivacySecurity = ({ user, onBack, onNotifications }) => {
    const [settings, setSettings] = useState({
        allowLastSeen: true
    });
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setSettings({ allowLastSeen: user.allowLastSeen !== false }); // Por defecto true
        }
    }, [user]);

    // Función para guardar cambios de privacidad
    const handleSavePrivacy = async () => {
        try {
            const response = await axios.put(`http://localhost:8081/api/auth/users/${user.id}`, {
                username: user.username,
                bio: user.bio,
                profilePhotoUrl: user.profilePhotoUrl,
                allowLastSeen: settings.allowLastSeen
            });
            alert('Configuración de privacidad actualizada');
            setMessage('Cambios guardados');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            alert('Error al guardar configuración');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md flex items-center justify-between">
                <button onClick={onBack} className="text-gray-400 hover:text-white">← Volver</button>
                <h2 className="text-xl font-bold">Privacidad y Seguridad</h2>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-8">

                {/* Sección Privacidad */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Privacidad</h3>
                    <div className="bg-slate-800 p-4 rounded-lg shadow space-y-4">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Última vez y En línea</p>
                                <p className="text-xs text-gray-400">Permite que otros vean cuándo estuviste por última vez.</p>
                            </div>
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.allowLastSeen}
                                    onChange={(e) => setSettings({ ...settings, allowLastSeen: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Foto de perfil</p>
                                <p className="text-xs text-gray-400">Solo contactos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked className="sr-only peer" disabled />
                                <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all opacity-50"></div>
                            </label>
                        </div>

                        {message && <p className="text-green-400 text-sm mt-2">{message}</p>}

                        <button
                            onClick={handleSavePrivacy}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-sm py-2 rounded transition"
                        >
                            Guardar Cambios de Privacidad
                        </button>
                    </div>
                </div>

                {/* Sección Seguridad */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Seguridad</h3>
                    <div className="bg-slate-800 p-4 rounded-lg shadow space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Autenticación de Dos Factores (2FA)</p>
                                <p className="text-xs text-gray-400">Mayor seguridad para tu cuenta.</p>
                            </div>
                            <button
                                onClick={() => alert('Función de 2FA (Próximamente)')}
                                className={`px-3 py-1 rounded text-sm font-bold ${twoFaEnabled ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {twoFaEnabled ? 'Activado' : 'Activar 2FA'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sección Dispositivos */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Dispositivos conectados</h3>
                    <div className="bg-slate-800 p-4 rounded-lg shadow space-y-3">

                        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💻</span>
                                <div>
                                    <p className="font-medium text-sm">Windows 11</p>
                                    <p className="text-xs text-green-400">Sesión actual</p>
                                </div>
                            </div>
                            <button className="text-xs text-gray-500 cursor-default">Activo</button>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📱</span>
                                <div>
                                    <p className="font-medium text-sm">iPhone 14 Pro</p>
                                    <p className="text-xs text-gray-400">Última actividad: Hace 2 horas</p>
                                </div>
                            </div>
                            <button className="text-xs text-red-400 hover:underline">Cerrar sesión</button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💻</span>
                                <div>
                                    <p className="font-medium text-sm">MacBook Pro</p>
                                    <p className="text-xs text-gray-400">Última actividad: Ayer</p>
                                </div>
                            </div>
                            <button className="text-xs text-red-400 hover:underline">Cerrar sesión</button>
                        </div>

                    </div>
                </div>

                {/* Enlace a Notificaciones */}
                <div className="mt-6 border-t border-slate-700 pt-4">
                    <button
                        onClick={onNotifications}
                        className="w-full text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 py-2 rounded hover:bg-slate-700 transition"
                    >
                        🔔 Ir a Configuración de Notificaciones
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PrivacySecurity;