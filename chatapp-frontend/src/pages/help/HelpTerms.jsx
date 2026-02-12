import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HelpTerms = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('terms'); // 'terms' o 'privacy'
    const [termsContent, setTermsContent] = useState(null);
    const [privacyContent, setPrivacyContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const [termsRes, privacyRes] = await Promise.all([
                axios.get('http://localhost:8081/api/support/terms'),
                axios.get('http://localhost:8081/api/support/privacy')
            ]);
            setTermsContent(termsRes.data);
            setPrivacyContent(privacyRes.data);
        } catch (error) {
            console.error('Error cargando contenido:', error);
            setError('Error al cargar los términos y condiciones');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                        ← Volver a Ayuda
                    </button>
                    <h2 className="text-xl font-bold">Términos y Privacidad</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Tabs de navegación */}
            <div className="border-b border-slate-700 bg-slate-800/50 sticky top-[73px] z-10">
                <div className="max-w-5xl mx-auto flex">
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={`px-6 py-4 font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === 'terms'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        📜 Términos y Condiciones
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`px-6 py-4 font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === 'privacy'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        🔒 Política de Privacidad
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6 max-w-5xl mx-auto">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-6 animate-pulse">📄</div>
                        <p className="text-gray-400">Cargando contenido legal...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-8 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={loadContent}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Términos y Condiciones */}
                        {activeTab === 'terms' && termsContent && (
                            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                <div className="p-8 border-b border-slate-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl font-bold mb-3">{termsContent.title}</h1>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-400">
                                                    📅 Última actualización: {formatDate(termsContent.lastUpdated)}
                                                </span>
                                                <span className="bg-slate-700 px-3 py-1 rounded-full text-xs">
                                                    Versión {termsContent.version}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="prose prose-invert max-w-none">
                                        {/* Contenido HTML parseado */}
                                        <div dangerouslySetInnerHTML={{ __html: termsContent.content }} />

                                        {/* Resumen de puntos clave */}
                                        <div className="mt-8 p-6 bg-slate-700/30 rounded-lg border border-slate-600">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                ⚡ Puntos clave
                                            </h3>
                                            <ul className="space-y-2 text-gray-300">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-400">✓</span>
                                                    Al usar ChatApp aceptas estos términos
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-400">✓</span>
                                                    Debes tener al menos 13 años para usar el servicio
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-400">✓</span>
                                                    Eres responsable de tu cuenta y contenido
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-yellow-400">!</span>
                                                    Podemos modificar estos términos con previo aviso
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                                    <p className="text-sm text-gray-400 text-center">
                                        Si tienes preguntas sobre estos términos, contacta a{' '}
                                        <a href="mailto:legal@chatapp.com" className="text-blue-400 hover:text-blue-300">
                                            legal@chatapp.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Política de Privacidad */}
                        {activeTab === 'privacy' && privacyContent && (
                            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                <div className="p-8 border-b border-slate-700 bg-gradient-to-r from-green-600/10 to-blue-600/10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl font-bold mb-3">{privacyContent.title}</h1>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-400">
                                                    📅 Última actualización: {formatDate(privacyContent.lastUpdated)}
                                                </span>
                                                <span className="bg-slate-700 px-3 py-1 rounded-full text-xs">
                                                    Versión {privacyContent.version}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="prose prose-invert max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: privacyContent.content }} />

                                        {/* Tus derechos según GDPR */}
                                        <div className="mt-8 p-6 bg-slate-700/30 rounded-lg border border-slate-600">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                🛡️ Tus derechos de privacidad
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-blue-400">🔍</span>
                                                    <div>
                                                        <p className="font-medium">Acceso</p>
                                                        <p className="text-xs text-gray-400">Solicita copia de tus datos</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-blue-400">✏️</span>
                                                    <div>
                                                        <p className="font-medium">Rectificación</p>
                                                        <p className="text-xs text-gray-400">Corrige información incorrecta</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-blue-400">🗑️</span>
                                                    <div>
                                                        <p className="font-medium">Eliminación</p>
                                                        <p className="text-xs text-gray-400">Solicita borrar tus datos</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-blue-400">⏸️</span>
                                                    <div>
                                                        <p className="font-medium">Portabilidad</p>
                                                        <p className="text-xs text-gray-400">Exporta tus datos</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                                    <p className="text-sm text-gray-400 text-center">
                                        Para ejercer tus derechos de privacidad, escribe a{' '}
                                        <a href="mailto:privacy@chatapp.com" className="text-blue-400 hover:text-blue-300">
                                            privacy@chatapp.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Botones de acción */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-4">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-2"
                    >
                        ← Volver
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 text-gray-400 hover:text-white transition flex items-center gap-1"
                        >
                            🖨️ Imprimir
                        </button>
                        <button
                            onClick={() => {/* Función para descargar PDF */}}
                            className="px-4 py-2 text-gray-400 hover:text-white transition flex items-center gap-1"
                        >
                            📥 Descargar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpTerms;