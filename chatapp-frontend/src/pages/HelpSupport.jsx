import React, { useState } from 'react';
import HelpFAQ from './help/HelpFAQ';
import HelpContact from './help/HelpContact';
import HelpTerms from './help/HelpTerms';
import HelpAccountManagement from './help/HelpAccountManagement';
import HelpSecurityPrivacy from './help/HelpSecurityPrivacy';
import HelpTroubleshooting from './help/HelpTroubleshooting';
import SystemStatus from './help/SystemStatus'; // <-- NUEVO IMPORT

const HelpSupport = ({ onBack, user }) => {
    const [currentView, setCurrentView] = useState('main'); // main, faq, contact, terms, account, security, troubleshooting, systemstatus

    // Renderizar según la vista seleccionada
    const renderView = () => {
        switch(currentView) {
            case 'faq':
                return <HelpFAQ onBack={() => setCurrentView('main')} />;
            case 'contact':
                return <HelpContact onBack={() => setCurrentView('main')} user={user} />;
            case 'terms':
                return <HelpTerms onBack={() => setCurrentView('main')} />;
            case 'account':
                return <HelpAccountManagement onBack={() => setCurrentView('main')} user={user} />;
            case 'security':
                return <HelpSecurityPrivacy onBack={() => setCurrentView('main')} />;
            case 'troubleshooting':
                return <HelpTroubleshooting onBack={() => setCurrentView('main')} />;
            case 'systemstatus': // <-- NUEVO CASO
                return <SystemStatus onBack={() => setCurrentView('main')} />;
            default:
                return (
                    <div className="min-h-screen bg-slate-900 text-white">
                        {/* Header */}
                        <div className="bg-slate-800 p-4 shadow-md flex items-center justify-between border-b border-slate-700">
                            <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                                ← Volver al Chat
                            </button>
                            <h2 className="text-xl font-bold">Centro de Ayuda</h2>
                            <div className="w-10"></div>
                        </div>

                        <div className="p-6 max-w-6xl mx-auto space-y-8">
                            {/* Banner de bienvenida */}
                            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-xl border border-blue-500/30">
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl">🎧</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">¿Cómo podemos ayudarte?</h3>
                                        <p className="text-gray-300">
                                            Hola {user?.username || 'usuario'}, encuentra respuestas rápidas o contacta con nuestro equipo de soporte.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 1: Acciones Rápidas */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                                    ⚡ Acciones Rápidas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setCurrentView('faq')}
                                        className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700 hover:border-blue-500/50 group"
                                    >
                                        <div className="text-5xl mb-3 group-hover:scale-110 transition">❓</div>
                                        <span className="font-medium text-lg">Preguntas Frecuentes</span>
                                        <span className="text-sm text-gray-400 mt-2">Respuestas a las dudas más comunes</span>
                                    </button>

                                    <button
                                        onClick={() => setCurrentView('contact')}
                                        className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700 hover:border-blue-500/50 group"
                                    >
                                        <div className="text-5xl mb-3 group-hover:scale-110 transition">🎧</div>
                                        <span className="font-medium text-lg">Contactar con Soporte</span>
                                        <span className="text-sm text-gray-400 mt-2">Habla con nuestro equipo de atención</span>
                                    </button>

                                    <button
                                        onClick={() => setCurrentView('terms')}
                                        className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700 hover:border-blue-500/50 group"
                                    >
                                        <div className="text-5xl mb-3 group-hover:scale-110 transition">📜</div>
                                        <span className="font-medium text-lg">Términos y Privacidad</span>
                                        <span className="text-sm text-gray-400 mt-2">Lee nuestras políticas y condiciones</span>
                                    </button>
                                </div>
                            </div>

                            {/* Sección 2: Categorías Populares */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                                    📂 Categorías Populares
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setCurrentView('account')}
                                        className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700 hover:border-green-500/50 group"
                                    >
                                        <div className="text-5xl mb-3 group-hover:scale-110 transition">👤</div>
                                        <div>
                                            <span className="font-medium text-lg">Gestión de Cuenta</span>
                                            <div className="flex flex-wrap justify-center gap-1 mt-2">
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Perfil</span>
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Contraseña</span>
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Configuración</span>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setCurrentView('security')}
                                        className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700 hover:border-green-500/50 group"
                                    >
                                        <div className="text-5xl mb-3 group-hover:scale-110 transition">🔒</div>
                                        <div>
                                            <span className="font-medium text-lg">Seguridad y Privacidad</span>
                                            <div className="flex flex-wrap justify-center gap-1 mt-2">
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">2FA</span>
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Privacidad</span>
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Dispositivos</span>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setCurrentView('troubleshooting')}
                                        className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700 hover:border-green-500/50 group"
                                    >
                                        <div className="text-5xl mb-3 group-hover:scale-110 transition">🔧</div>
                                        <div>
                                            <span className="font-medium text-lg">Resolución de Problemas</span>
                                            <div className="flex flex-wrap justify-center gap-1 mt-2">
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Conexión</span>
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Mensajes</span>
                                                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">Notificaciones</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Sección 3: Estado del sistema - MODIFICADO */}
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl">📊</div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Estado del sistema</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                <span className="text-sm text-gray-400">Todos los sistemas operativos normalmente</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentView('systemstatus')} // <-- NUEVO
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition hover:scale-105 active:scale-95"
                                    >
                                        Ver estado detallado →
                                    </button>
                                </div>
                            </div>

                            {/* Sección 4: Contacto adicional */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">📧</div>
                                        <div>
                                            <p className="font-medium">Email de soporte</p>
                                            <a href="mailto:soporte@chatapp.com" className="text-sm text-blue-400 hover:text-blue-300">
                                                soporte@chatapp.com
                                            </a>
                                            <p className="text-xs text-gray-500 mt-1">Respuesta en 24-48h</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">🕐</div>
                                        <div>
                                            <p className="font-medium">Horario de atención</p>
                                            <p className="text-sm text-gray-300">Lunes a Viernes: 9:00 - 18:00</p>
                                            <p className="text-sm text-gray-300">Sábados: 10:00 - 14:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 5: Feedback */}
                            <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                                <p className="text-gray-400 mb-3">¿Te fue útil esta sección de ayuda?</p>
                                <div className="flex justify-center gap-4">
                                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition flex items-center gap-2">
                                        👍 Sí
                                    </button>
                                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition flex items-center gap-2">
                                        👎 No
                                    </button>
                                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition flex items-center gap-2">
                                        💡 Sugerir mejora
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return renderView();
};

export default HelpSupport;