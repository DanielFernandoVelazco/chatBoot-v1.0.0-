import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationsSettings = ({ user, onBack }) => {
    // Estado local para los ajustes granulares
    const [settings, setSettings] = useState({
        globalEnabled: true,
        sounds: true,
        vibration: true,
        desktopNotifications: true,
        messages: true,
        mentionsOnly: false
    });

    useEffect(() => {
        if (user) {
            setSettings({
                ...settings,
                globalEnabled: user.notificationsEnabled !== false
            });
        }
    }, [user]);

    const handleToggle = (key) => {
        setSettings({
            ...settings,
            [key]: !settings[key]
        });
    };

    // Guardar el estado "Global" en la base de datos
    const handleSaveGlobal = async () => {
        try {
            await axios.put(`http://localhost:8081/api/auth/users/${user.id}`, {
                username: user.username,
                bio: user.bio,
                profilePhotoUrl: user.profilePhotoUrl,
                notificationsEnabled: settings.globalEnabled
            });
            alert('Configuración de notificaciones guardada');
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
                <h2 className="text-xl font-bold">Configuración de Notificaciones</h2>
                <div className="w-10"></div>
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-8">

                {/* Sección General */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Notificaciones Generales</h3>
                    <div className="bg-slate-800 p-4 rounded-lg shadow space-y-4">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Notificaciones de Escritorio</p>
                                <p className="text-xs text-gray-400">Mostrar alertas en tu pantalla.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.desktopNotifications}
                                    onChange={() => handleToggle('desktopNotifications')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Habilitar Notificaciones</p>
                                <p className="text-xs text-gray-400">Activa/Desactiva todas las notificaciones.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.globalEnabled}
                                    onChange={() => handleToggle('globalEnabled')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <button
                            onClick={handleSaveGlobal}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-sm py-2 rounded transition mt-2"
                        >
                            Guardar Preferencias Globales
                        </button>
                    </div>
                </div>

                {/* Sección Sonidos */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Sonidos y Vibración</h3>
                    <div className="bg-slate-800 p-4 rounded-lg shadow space-y-4">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Sonidos de Mensajes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.sounds}
                                    onChange={() => handleToggle('sounds')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Vibración</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.vibration}
                                    onChange={() => handleToggle('vibration')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>

                    </div>
                </div>

                {/* Sección Tipos de Mensaje */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Configuración por Tipo de Mensaje</h3>
                    <div className="bg-slate-800 p-4 rounded-lg shadow space-y-4">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Mensajes Privados</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={settings.messages} disabled className="sr-only peer" />
                                <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all opacity-75"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Menciones (@)</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!settings.mentionsOnly}
                                    onChange={() => handleToggle('mentionsOnly')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotificationsSettings;