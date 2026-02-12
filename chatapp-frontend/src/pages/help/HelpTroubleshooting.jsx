import React, { useState } from 'react';

const HelpTroubleshooting = ({ onBack }) => {
    const [activeCategory, setActiveCategory] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'todos', name: 'Todos los problemas', icon: '🔍' },
        { id: 'conexion', name: 'Conexión', icon: '📶' },
        { id: 'mensajes', name: 'Mensajes', icon: '💬' },
        { id: 'notificaciones', name: 'Notificaciones', icon: '🔔' },
        { id: 'audio-video', name: 'Audio/Video', icon: '📹' },
        { id: 'cuenta', name: 'Cuenta', icon: '👤' }
    ];

    const problems = [
        {
            id: 1,
            title: "No puedo conectarme al chat",
            category: "conexion",
            icon: "📶",
            severity: "alta",
            symptoms: [
                "El chat no carga los mensajes",
                "Aparece el mensaje 'Error de conexión'",
                "Los mensajes no se envían"
            ],
            solutions: [
                {
                    title: "Verifica tu conexión a internet",
                    steps: [
                        "Asegúrate de estar conectado a WiFi o datos móviles",
                        "Prueba abrir otra página web para confirmar",
                        "Reinicia tu router/módem"
                    ]
                },
                {
                    title: "Reinicia la aplicación",
                    steps: [
                        "Cierra completamente la aplicación",
                        "Vuelve a abrirla",
                        "Intenta reconectarte"
                    ]
                },
                {
                    title: "Verifica el estado del servidor",
                    steps: [
                        "Revisa si hay problemas conocidos",
                        "Espera unos minutos e intenta nuevamente"
                    ]
                }
            ],
            tips: ["El servidor se reinicia los martes a las 3:00 AM (puede haber caídas breves)"]
        },
        {
            id: 2,
            title: "Los mensajes no se envían",
            category: "mensajes",
            icon: "💬",
            severity: "alta",
            symptoms: [
                "El mensaje queda con estado 'enviando'",
                "Aparece un icono de error ⚠️",
                "El receptor no recibe el mensaje"
            ],
            solutions: [
                {
                    title: "Verifica la conexión",
                    steps: [
                        "Comprueba tu señal de internet",
                        "Intenta enviar un mensaje más corto",
                        "Espera unos segundos y reintenta"
                    ]
                },
                {
                    title: "Reinicia el chat",
                    steps: [
                        "Cierra y vuelve a abrir la conversación",
                        "Actualiza la página (F5)",
                        "Vuelve a intentar enviar el mensaje"
                    ]
                }
            ],
            tips: ["Los mensajes con muchas imágenes pueden tardar más en enviarse"]
        },
        {
            id: 3,
            title: "No recibo notificaciones",
            category: "notificaciones",
            icon: "🔔",
            severity: "media",
            symptoms: [
                "No aparecen alertas en el escritorio",
                "No se escuchan sonidos al recibir mensajes",
                "La aplicación no vibra en móvil"
            ],
            solutions: [
                {
                    title: "Verifica la configuración de notificaciones",
                    steps: [
                        "Ve a Configuración de Notificaciones",
                        "Asegúrate que 'Habilitar Notificaciones' esté activado",
                        "Verifica que los sonidos estén habilitados"
                    ]
                },
                {
                    title: "Permisos del navegador",
                    steps: [
                        "Haz clic en el icono de candado en la barra de direcciones",
                        "Busca 'Notificaciones'",
                        "Selecciona 'Permitir'"
                    ]
                }
            ],
            tips: ["Si usas Chrome, verifica que no esté en modo 'No molestar'"]
        },
        {
            id: 4,
            title: "Error al iniciar sesión",
            category: "cuenta",
            icon: "🔑",
            severity: "alta",
            symptoms: [
                "Mensaje 'Credenciales incorrectas'",
                "No puedo acceder aunque la contraseña es correcta",
                "La página se queda cargando"
            ],
            solutions: [
                {
                    title: "Verifica tus credenciales",
                    steps: [
                        "Confirma que el email esté escrito correctamente",
                        "Prueba con la función '¿Olvidaste tu contraseña?'",
                        "Revisa que no tengas Bloq Mayús activado"
                    ]
                },
                {
                    title: "Limpia caché y cookies",
                    steps: [
                        "Ve a la configuración de tu navegador",
                        "Busca 'Borrar datos de navegación'",
                        "Selecciona 'Cookies y caché'",
                        "Reinicia el navegador"
                    ]
                }
            ],
            tips: ["Si el problema persiste, contacta a soporte con tu número de ticket"]
        },
        {
            id: 5,
            title: "La IA no responde",
            category: "mensajes",
            icon: "🤖",
            severity: "media",
            symptoms: [
                "El modo IA está activado pero no hay respuesta",
                "Mensaje de 'Error conectando con la IA'",
                "La IA tarda mucho en responder"
            ],
            solutions: [
                {
                    title: "Verifica el modo IA",
                    steps: [
                        "Asegúrate que el botón 🤖 esté activado (color morado)",
                        "Desactiva y reactiva el modo IA",
                        "Prueba con una pregunta más simple"
                    ]
                },
                {
                    title: "Problemas del servidor",
                    steps: [
                        "La IA puede estar temporalmente fuera de servicio",
                        "Espera unos minutos e intenta nuevamente",
                        "Cambia a modo humano mientras se restablece"
                    ]
                }
            ],
            tips: ["La IA funciona mejor con preguntas específicas y claras"]
        },
        {
            id: 6,
            title: "Problemas con el WebSocket",
            category: "conexion",
            icon: "🔌",
            severity: "alta",
            symptoms: [
                "Los mensajes no llegan en tiempo real",
                "Desconexiones frecuentes",
                "Error de conexión en la consola"
            ],
            solutions: [
                {
                    title: "Reconectar WebSocket",
                    steps: [
                        "Actualiza la página (F5)",
                        "Cierra y vuelve a abrir la pestaña",
                        "Verifica que no haya firewalls bloqueando"
                    ]
                }
            ],
            tips: ["Si el problema persiste, prueba con otro navegador"]
        },
        {
            id: 7,
            title: "No puedo subir imágenes",
            category: "mensajes",
            icon: "🖼️",
            severity: "baja",
            symptoms: [
                "El selector de archivos no se abre",
                "La imagen no se envía",
                "Error al cargar el archivo"
            ],
            solutions: [
                {
                    title: "Verifica el formato",
                    steps: [
                        "Formatos permitidos: JPG, PNG, GIF",
                        "Tamaño máximo: 5MB",
                        "Prueba con una imagen más pequeña"
                    ]
                }
            ],
            tips: ["Las imágenes se comprimen automáticamente para mejorar la velocidad"]
        },
        {
            id: 8,
            title: "La aplicación va lenta",
            category: "rendimiento",
            icon: "🐢",
            severity: "media",
            symptoms: [
                "Los mensajes tardan en aparecer",
                "La interfaz se siente pesada",
                "Cambios de pantalla lentos"
            ],
            solutions: [
                {
                    title: "Mejora el rendimiento",
                    steps: [
                        "Cierra pestañas que no uses",
                        "Limpia caché del navegador",
                        "Verifica que no haya extensiones conflictivas",
                        "Actualiza tu navegador a la última versión"
                    ]
                }
            ],
            tips: ["Chrome y Edge ofrecen mejor rendimiento para ChatApp"]
        }
    ];

    const filteredProblems = problems.filter(problem => {
        const matchesCategory = activeCategory === 'todos' || problem.category === activeCategory;
        const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            problem.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'alta': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'media': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'baja': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                        ← Volver a Ayuda
                    </button>
                    <h2 className="text-xl font-bold">Resolución de Problemas</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="p-6 max-w-6xl mx-auto">
                {/* Buscador */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Buscar problemas, síntomas o soluciones..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-4 top-4.5 text-gray-400 text-xl">🔍</div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-4.5 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Categorías */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                        📂 Filtrar por categoría
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                                    activeCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resultados */}
                <div className="space-y-6">
                    {filteredProblems.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/50 rounded-xl">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-gray-400 text-lg mb-2">No se encontraron resultados</p>
                            <p className="text-sm text-gray-500">Prueba con otros términos o categorías</p>
                            <button
                                onClick={() => { setSearchTerm(''); setActiveCategory('todos'); }}
                                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                            >
                                Ver todos los problemas
                            </button>
                        </div>
                    ) : (
                        filteredProblems.map(problem => (
                            <div key={problem.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition">
                                {/* Header del problema */}
                                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-800/50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="text-4xl">{problem.icon}</div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold">{problem.title}</h3>
                                                    <span className={`text-xs px-3 py-1 rounded-full border ${getSeverityColor(problem.severity)}`}>
                                                        Severidad {problem.severity}
                                                    </span>
                                                </div>

                                                {/* Síntomas */}
                                                <div className="mt-3">
                                                    <p className="text-sm font-semibold text-gray-400 mb-2">Síntomas:</p>
                                                    <ul className="space-y-1">
                                                        {problem.symptoms.map((symptom, idx) => (
                                                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                                                <span className="text-red-400">⚠️</span>
                                                                {symptom}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Soluciones */}
                                <div className="p-6">
                                    <h4 className="text-md font-semibold text-green-400 mb-4 flex items-center gap-2">
                                        🛠️ Soluciones:
                                    </h4>
                                    <div className="space-y-4">
                                        {problem.solutions.map((solution, idx) => (
                                            <div key={idx} className="bg-slate-700/30 p-4 rounded-lg">
                                                <p className="font-medium mb-2 text-blue-300">{solution.title}</p>
                                                <ol className="space-y-2">
                                                    {solution.steps.map((step, stepIdx) => (
                                                        <li key={stepIdx} className="flex items-start gap-3 text-sm text-gray-300">
                                                            <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs flex-shrink-0">
                                                                {stepIdx + 1}
                                                            </span>
                                                            <span>{step}</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tips */}
                                    {problem.tips && problem.tips.length > 0 && (
                                        <div className="mt-4 p-4 bg-purple-600/10 rounded-lg">
                                            <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                                💡 Tip:
                                            </h4>
                                            <p className="text-sm text-gray-300">{problem.tips[0]}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex justify-end">
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition flex items-center gap-2">
                                        📋 Reportar este problema
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Diagnóstico rápido */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">🔧</div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">¿No encuentras tu problema?</h3>
                                <p className="text-sm text-gray-300">
                                    Prueba nuestro diagnóstico rápido o contacta a soporte técnico
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
                                Iniciar diagnóstico
                            </button>
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2">
                                🎧 Contactar soporte
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpTroubleshooting;