import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemStatus = ({ onBack }) => {
    const [status, setStatus] = useState({
        api: 'checking',
        websocket: 'checking',
        database: 'checking',
        ai: 'checking'
    });
    const [incidents, setIncidents] = useState([]);
    const [uptime, setUptime] = useState(99.98);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [activeTab, setActiveTab] = useState('status');

    // Simular verificación de estado
    useEffect(() => {
        checkSystemStatus();

        // Actualizar cada 30 segundos
        const interval = setInterval(checkSystemStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const checkSystemStatus = async () => {
        try {
            // Verificar API
            const apiStart = Date.now();
            await axios.get('http://localhost:8081/api/support/faq', { timeout: 5000 });
            const apiLatency = Date.now() - apiStart;

            setStatus(prev => ({
                ...prev,
                api: apiLatency < 500 ? 'operational' : apiLatency < 1000 ? 'degraded' : 'slow'
            }));

            // Verificar WebSocket (simulado)
            setStatus(prev => ({
                ...prev,
                websocket: 'operational',
                database: 'operational',
                ai: Math.random() > 0.1 ? 'operational' : 'degraded' // Simulación
            }));

            setLastUpdated(new Date());
        } catch (error) {
            setStatus(prev => ({
                ...prev,
                api: 'down'
            }));
        }
    };

    // Incidentes simulados
    useEffect(() => {
        setIncidents([
            {
                id: 1,
                title: "Mantenimiento programado del servidor",
                status: "resolved",
                date: "2026-02-09",
                description: "El sistema estará en mantenimiento el 15 de febrero de 2026 de 3:00 AM a 5:00 AM (UTC-5). Durante este período, el servicio de chat podría presentar intermitencias.",
                components: ["api", "websocket"],
                resolution: "Mantenimiento completado exitosamente. Todos los sistemas operativos."
            },
            {
                id: 2,
                title: "Problemas de conexión WebSocket",
                status: "monitoring",
                date: "2026-02-10",
                description: "Estamos investigando reportes de usuarios con desconexiones intermitentes en el chat en tiempo real.",
                components: ["websocket"],
                resolution: "Hemos implementado una solución. Continuamos monitoreando la estabilidad del servicio."
            },
            {
                id: 3,
                title: "Lentitud en respuestas de IA",
                status: "investigating",
                date: "2026-02-11",
                description: "Algunos usuarios están experimentando demoras en las respuestas del asistente IA. Estamos trabajando para optimizar el servicio.",
                components: ["ai"],
                resolution: "Identificamos un cuello de botella en el procesamiento. Estamos escalando recursos."
            }
        ]);
    }, []);

    const getStatusColor = (serviceStatus) => {
        switch(serviceStatus) {
            case 'operational': return 'bg-green-500';
            case 'degraded': return 'bg-yellow-500';
            case 'slow': return 'bg-orange-500';
            case 'down': return 'bg-red-500';
            default: return 'bg-gray-500 animate-pulse';
        }
    };

    const getStatusText = (serviceStatus) => {
        switch(serviceStatus) {
            case 'operational': return 'Operacional';
            case 'degraded': return 'Rendimiento degradado';
            case 'slow': return 'Respuesta lenta';
            case 'down': return 'Caído';
            default: return 'Verificando...';
        }
    };

    const getIncidentBadge = (status) => {
        switch(status) {
            case 'investigating': return { text: 'Investigando', color: 'bg-yellow-500/20 text-yellow-400' };
            case 'monitoring': return { text: 'Monitoreando', color: 'bg-blue-500/20 text-blue-400' };
            case 'resolved': return { text: 'Resuelto', color: 'bg-green-500/20 text-green-400' };
            default: return { text: status, color: 'bg-gray-500/20 text-gray-400' };
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                        ← Volver al Centro de Ayuda
                    </button>
                    <h2 className="text-xl font-bold">Estado del Sistema</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700 bg-slate-800/50 sticky top-[73px] z-10">
                <div className="max-w-5xl mx-auto flex">
                    <button
                        onClick={() => setActiveTab('status')}
                        className={`px-6 py-4 font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === 'status'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        📊 Estado Actual
                    </button>
                    <button
                        onClick={() => setActiveTab('incidents')}
                        className={`px-6 py-4 font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === 'incidents'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        🚨 Incidentes
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-4 font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === 'history'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        📅 Historial
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-5xl mx-auto">
                {/* TAB: ESTADO ACTUAL */}
                {activeTab === 'status' && (
                    <>
                        {/* Banner de estado general */}
                        <div className={`mb-8 p-6 rounded-xl border ${
                            Object.values(status).every(s => s === 'operational')
                                ? 'bg-green-500/10 border-green-500/30'
                                : Object.values(status).some(s => s === 'down')
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : 'bg-yellow-500/10 border-yellow-500/30'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded-full ${
                                    Object.values(status).every(s => s === 'operational')
                                        ? 'bg-green-500 animate-pulse'
                                        : Object.values(status).some(s => s === 'down')
                                            ? 'bg-red-500 animate-pulse'
                                            : 'bg-yellow-500 animate-pulse'
                                }`}></div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">
                                        {Object.values(status).every(s => s === 'operational')
                                            ? '✅ Todos los sistemas operativos'
                                            : Object.values(status).some(s => s === 'down')
                                                ? '⚠️ Problemas detectados en algunos servicios'
                                                : '🟡 Rendimiento degradado en algunos servicios'
                                        }
                                    </h3>
                                    <p className="text-gray-400">
                                        Última actualización: {lastUpdated.toLocaleTimeString()} - Tiempo de actividad: {uptime}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grid de servicios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* API */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">🌐</div>
                                        <div>
                                            <h4 className="font-semibold">API REST</h4>
                                            <p className="text-sm text-gray-400">Servidor principal</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status.api)}`}></div>
                                        <span className="text-xs mt-1 text-gray-400">{getStatusText(status.api)}</span>
                                    </div>
                                </div>
                                {status.api === 'operational' && (
                                    <div className="mt-4 text-sm text-green-400 flex items-center gap-1">
                                        <span>✓</span> Latencia normal
                                    </div>
                                )}
                            </div>

                            {/* WebSocket */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">🔌</div>
                                        <div>
                                            <h4 className="font-semibold">WebSocket</h4>
                                            <p className="text-sm text-gray-400">Chat en tiempo real</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status.websocket)}`}></div>
                                        <span className="text-xs mt-1 text-gray-400">{getStatusText(status.websocket)}</span>
                                    </div>
                                </div>
                                {status.websocket === 'operational' && (
                                    <div className="mt-4 text-sm text-green-400 flex items-center gap-1">
                                        <span>✓</span> Conexiones estables
                                    </div>
                                )}
                            </div>

                            {/* Base de datos */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">🗄️</div>
                                        <div>
                                            <h4 className="font-semibold">Base de datos</h4>
                                            <p className="text-sm text-gray-400">Almacenamiento de mensajes</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status.database)}`}></div>
                                        <span className="text-xs mt-1 text-gray-400">{getStatusText(status.database)}</span>
                                    </div>
                                </div>
                                {status.database === 'operational' && (
                                    <div className="mt-4 text-sm text-green-400 flex items-center gap-1">
                                        <span>✓</span> 99.9% disponibilidad
                                    </div>
                                )}
                            </div>

                            {/* IA */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">🤖</div>
                                        <div>
                                            <h4 className="font-semibold">Asistente IA</h4>
                                            <p className="text-sm text-gray-400">Respuestas automáticas</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status.ai)}`}></div>
                                        <span className="text-xs mt-1 text-gray-400">{getStatusText(status.ai)}</span>
                                    </div>
                                </div>
                                {status.ai === 'degraded' && (
                                    <div className="mt-4 text-sm text-yellow-400 flex items-center gap-1">
                                        <span>⚠️</span> Respuestas más lentas de lo normal
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SLA y métricas */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-xl border border-blue-500/30 mb-8">
                            <h4 className="font-semibold mb-4 flex items-center gap-2">📈 SLA - Acuerdo de Nivel de Servicio</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-blue-400">99.98%</p>
                                    <p className="text-sm text-gray-400">Tiempo de actividad</p>
                                    <p className="text-xs text-gray-500">Últimos 30 días</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-blue-400">&lt;200ms</p>
                                    <p className="text-sm text-gray-400">Latencia promedio</p>
                                    <p className="text-xs text-gray-500">API REST</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-blue-400">24/7</p>
                                    <p className="text-sm text-gray-400">Soporte técnico</p>
                                    <p className="text-xs text-gray-500">Disponibilidad</p>
                                </div>
                            </div>
                        </div>

                        {/* Botón de verificación manual */}
                        <div className="flex justify-center">
                            <button
                                onClick={checkSystemStatus}
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition flex items-center gap-2"
                            >
                                🔄 Verificar estado ahora
                            </button>
                        </div>
                    </>
                )}

                {/* TAB: INCIDENTES */}
                {activeTab === 'incidents' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                                🚨 Incidentes activos y recientes
                            </h3>
                            <span className="bg-slate-700 px-3 py-1 rounded-full text-xs">
                                {incidents.length} incidentes
                            </span>
                        </div>

                        {incidents.map(incident => {
                            const badge = getIncidentBadge(incident.status);
                            return (
                                <div key={incident.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-xs px-3 py-1 rounded-full ${badge.color}`}>
                                                        {badge.text}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(incident.date).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold">{incident.title}</h4>
                                            </div>
                                        </div>

                                        <p className="text-gray-300 mb-4">{incident.description}</p>

                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-400 mb-2">Componentes afectados:</p>
                                            <div className="flex gap-2">
                                                {incident.components.map(comp => (
                                                    <span key={comp} className="bg-slate-700 text-xs px-3 py-1 rounded-full">
                                                        {comp === 'api' && '🌐 API'}
                                                        {comp === 'websocket' && '🔌 WebSocket'}
                                                        {comp === 'database' && '🗄️ Base de datos'}
                                                        {comp === 'ai' && '🤖 IA'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {incident.resolution && (
                                            <div className="bg-slate-700/30 p-4 rounded-lg">
                                                <p className="text-sm font-semibold text-green-400 mb-1">Resolución:</p>
                                                <p className="text-sm text-gray-300">{incident.resolution}</p>
                                            </div>
                                        )}

                                        {incident.status === 'monitoring' && (
                                            <div className="mt-4 flex items-center gap-2 text-yellow-400 text-sm">
                                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                                Estamos monitoreando la solución implementada
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/30 mt-6">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">📧</div>
                                <div>
                                    <p className="font-semibold mb-1">¿No encuentras un incidente?</p>
                                    <p className="text-sm text-gray-400">
                                        Si experimentas un problema no listado aquí, por favor contacta a soporte.
                                    </p>
                                </div>
                                <button className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition">
                                    Reportar problema
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: HISTORIAL */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                            📅 Historial de disponibilidad
                        </h3>

                        {/* Calendario de estado */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-semibold">Febrero 2026</h4>
                                <div className="flex gap-2">
                                    <button className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded hover:bg-slate-600">←</button>
                                    <button className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded hover:bg-slate-600">→</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                    <div key={day} className="text-center text-xs text-gray-500 py-2">{day}</div>
                                ))}
                                {[...Array(28)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-slate-700/30 rounded-lg p-2 flex flex-col items-center">
                                        <span className="text-sm">{i + 1}</span>
                                        <div className={`w-2 h-2 rounded-full mt-1 ${
                                            i < 10 ? 'bg-green-500' :
                                                i === 15 ? 'bg-yellow-500' :
                                                    i === 22 ? 'bg-red-500' : 'bg-green-500'
                                        }`}></div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-gray-400">Operacional</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span className="text-xs text-gray-400">Degradado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-xs text-gray-400">Caído</span>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas mensuales */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <p className="text-sm text-gray-400 mb-1">Tiempo activo</p>
                                <p className="text-2xl font-bold text-green-400">99.99%</p>
                                <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <p className="text-sm text-gray-400 mb-1">Incidentes</p>
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-xs text-gray-500 mt-1">2 resueltos, 1 activo</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <p className="text-sm text-gray-400 mb-1">Tiempo medio de respuesta</p>
                                <p className="text-2xl font-bold">243ms</p>
                                <p className="text-xs text-gray-500 mt-1">API REST</p>
                            </div>
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-8">
                            ⚡ Los datos de disponibilidad se actualizan cada 5 minutos
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700 bg-slate-800/50 p-4 mt-8">
                <div className="max-w-5xl mx-auto flex justify-between items-center text-xs text-gray-500">
                    <span>ID de sesión: {Math.random().toString(36).substring(7)}</span>
                    <span>Última verificación: {lastUpdated.toLocaleString()}</span>
                    <a href="#" className="text-blue-400 hover:text-blue-300">Suscribirse a notificaciones</a>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;