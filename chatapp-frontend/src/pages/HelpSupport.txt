import React, { useState } from 'react';

const HelpSupport = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md flex items-center justify-between border-b border-slate-700">
                <button onClick={onBack} className="text-gray-400 hover:text-white">← Volver</button>
                <h2 className="text-xl font-bold">Ayuda y Soporte</h2>
                <div className="w-10"></div>
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-8">

                {/* Buscador */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Busca en nuestra base de conocimientos..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">🔍</div>
                </div>

                {/* Acciones Rápidas */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Acciones Rápidas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <button className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700">
                            <div className="text-4xl mb-2">❓</div>
                            <span className="font-medium">Preguntas Frecuentes</span>
                        </button>

                        <button className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700">
                            <div className="text-4xl mb-2">🎧</div>
                            <span className="font-medium">Contactar con Soporte</span>
                        </button>

                        <button className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700">
                            <div className="text-4xl mb-2">📜</div>
                            <span className="font-medium">Términos y Privacidad</span>
                        </button>

                    </div>
                </div>

                {/* Categorías Populares */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Categorías Populares</h3>
                    <div className="bg-slate-800 rounded-lg shadow border border-slate-700 overflow-hidden">

                        <div className="p-4 border-b border-slate-700 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition">
                            <div className="flex items-center gap-3">
                                <span className="text-blue-400">👤</span>
                                <div>
                                    <p className="font-medium">Gestión de Cuenta</p>
                                    <p className="text-xs text-gray-400">Perfil, Privacidad, Seguridad</p>
                                </div>
                            </div>
                            <span>→</span>
                        </div>

                        <div className="p-4 border-b border-slate-700 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition">
                            <div className="flex items-center gap-3">
                                <span className="text-green-400">🔒</span>
                                <div>
                                    <p className="font-medium">Seguridad y Privacidad</p>
                                    <p className="text-xs text-gray-400">Contraseñas, 2FA, Datos</p>
                                </div>
                            </div>
                            <span>→</span>
                        </div>

                        <div className="p-4 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition">
                            <div className="flex items-center gap-3">
                                <span className="text-red-400">🔧</span>
                                <div>
                                    <p className="font-medium">Resolución de Problemas</p>
                                    <p className="text-xs text-gray-400">Errores de conexión, Mensajes</p>
                                </div>
                            </div>
                            <span>→</span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default HelpSupport;