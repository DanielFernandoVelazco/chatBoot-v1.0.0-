import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivacySecurity = ({ user, onBack, onNotifications }) => {
    const [settings, setSettings] = useState({
        allowLastSeen: true
    });
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setSettings({
                allowLastSeen: user.allowLastSeen !== false
            });
        }
    }, [user]);

    // Función para guardar cambios de privacidad - CONECTADO AL BACKEND
    const handleSavePrivacy = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.put(`http://localhost:8081/api/auth/users/${user.id}`, {
                username: user.username,
                bio: user.bio || '',
                profilePhotoUrl: user.profilePhotoUrl || '',
                notificationsEnabled: user.notificationsEnabled,
                allowLastSeen: settings.allowLastSeen // NUEVO: Enviar al backend
            });

            // Actualizar usuario en localStorage
            const updatedUser = { ...user, allowLastSeen: settings.allowLastSeen };
            localStorage.setItem('chatUser', JSON.stringify(updatedUser));

            setMessage('✅ Configuración de privacidad actualizada correctamente');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error guardando configuración:', error);
            setMessage('❌ Error al guardar configuración');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md flex items-center justify-between border-b border-slate-700 sticky top-0 z-10">
                <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                    ← Volver
                </button>
                <h2 className="text-xl font-bold">Privacidad y Seguridad</h2>
                <div className="w-10"></div>
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-8">
                {/* Mensaje de éxito/error */}
                {message && (
                    <div className={`p-4 rounded-lg ${
                        message.includes('✅')
                            ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                            : 'bg-red-500/20 border border-red-500/50 text-red-400'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Sección Privacidad - CONECTADA AL BACKEND */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                        👁️ Privacidad
                    </h3>
                    <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700 space-y-6">

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium text-white">Última vez y En línea</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Permite que otros usuarios vean cuándo fue tu última conexión.
                                    {!settings.allowLastSeen && (
                                        <span className="block mt-1 text-yellow-400">
                                            ⚠️ Si desactivas esta opción, tampoco podrás ver la última vez de otros usuarios.
                                        </span>
                                    )}
                                </p>
                                {user?.lastSeen && settings.allowLastSeen && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        📅 Última conexión: {user.lastSeenText || 'Recientemente'}
                                    </p>
                                )}
                            </div>
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                                <input
                                    type="checkbox"
                                    checked={settings.allowLastSeen}
                                    onChange={(e) => setSettings({ ...settings, allowLastSeen: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between opacity-75">
                            <div>
                                <p className="font-medium text-white">Foto de perfil</p>
                                <p className="text-xs text-gray-400">Visible para todos los usuarios</p>
                            </div>
                            <span className="px-3 py-1 bg-slate-700 text-xs rounded-full text-gray-300">
                                Público
                            </span>
                        </div>

                        <div className="flex items-center justify-between opacity-75">
                            <div>
                                <p className="font-medium text-white">Estado / Bio</p>
                                <p className="text-xs text-gray-400">Visible para todos los usuarios</p>
                            </div>
                            <span className="px-3 py-1 bg-slate-700 text-xs rounded-full text-gray-300">
                                Público
                            </span>
                        </div>

                        <button
                            onClick={handleSavePrivacy}
                            disabled={isLoading}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    💾 Guardar Cambios de Privacidad
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Sección Seguridad */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                        🔒 Seguridad
                    </h3>
                    <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-white">Autenticación de Dos Factores (2FA)</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Mayor seguridad para tu cuenta. Recibirás un código adicional al iniciar sesión.
                                </p>
                            </div>
                            <button
                                onClick={() => alert('🔐 Función de 2FA próximamente disponible')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    twoFaEnabled
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {twoFaEnabled ? '✓ Activado' : 'Activar 2FA'}
                            </button>
                        </div>

                        <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                            <p className="text-xs text-yellow-400 flex items-start gap-2">
                                <span className="text-lg">🔔</span>
                                <span>
                                    <strong>Próximamente:</strong> Autenticación de dos factores,
                                    notificaciones de inicio de sesión y más características de seguridad.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sección Dispositivos conectados - Mejorada */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                        📱 Dispositivos conectados
                    </h3>
                    <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700 space-y-4">

                        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💻</span>
                                <div>
                                    <p className="font-medium">Windows 11</p>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Sesión actual
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">Este dispositivo</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📱</span>
                                <div>
                                    <p className="font-medium">iPhone 14 Pro</p>
                                    <p className="text-xs text-gray-400">Última actividad: Hace 2 horas</p>
                                </div>
                            </div>
                            <button className="text-xs text-red-400 hover:text-red-300 hover:underline">
                                Cerrar sesión
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💻</span>
                                <div>
                                    <p className="font-medium">MacBook Pro</p>
                                    <p className="text-xs text-gray-400">Última actividad: Ayer</p>
                                </div>
                            </div>
                            <button className="text-xs text-red-400 hover:text-red-300 hover:underline">
                                Cerrar sesión
                            </button>
                        </div>

                        <button className="w-full mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 py-2">
                            🔄 Ver todos los dispositivos
                        </button>
                    </div>
                </div>

                {/* Consejo de privacidad */}
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-lg border border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl">💡</div>
                        <div>
                            <h4 className="font-semibold mb-1">Consejo de privacidad</h4>
                            <p className="text-sm text-gray-400">
                                La opción "Última vez y En línea" es recíproca:
                                {settings.allowLastSeen
                                    ? ' al activarla, podrás ver la última conexión de otros y ellos podrán ver la tuya.'
                                    : ' al desactivarla, no podrás ver la última conexión de otros y ellos tampoco podrán ver la tuya.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enlace a Notificaciones */}
                <div className="border-t border-slate-700 pt-6">
                    <button
                        onClick={onNotifications}
                        className="w-full text-gray-400 hover:text-white flex items-center justify-center gap-2 py-3 px-4 rounded-lg hover:bg-slate-800 transition"
                    >
                        🔔 Ir a Configuración de Notificaciones →
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PrivacySecurity;