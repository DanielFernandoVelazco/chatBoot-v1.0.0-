import React from 'react';

const HelpSecurityPrivacy = ({ onBack }) => {
    const securityTopics = [
        {
            id: 1,
            title: "Autenticación de Dos Factores (2FA)",
            description: "Añade una capa extra de seguridad a tu cuenta",
            icon: "🔐",
            status: "coming-soon",
            steps: [
                "Ve a 'Privacidad y Seguridad' desde el menú de ajustes",
                "Selecciona 'Autenticación de Dos Factores'",
                "Elige el método: SMS o aplicación autenticadora",
                "Escanea el código QR con tu app (Google Authenticator, Authy)",
                "Ingresa el código de verificación",
                "¡Listo! 2FA activado"
            ],
            benefits: [
                "Protección contra accesos no autorizados",
                "Notificaciones de intentos de inicio de sesión",
                "Mayor seguridad para tu información personal"
            ]
        },
        {
            id: 2,
            title: "Contraseñas seguras",
            description: "Buenas prácticas para proteger tu cuenta",
            icon: "🔑",
            tips: [
                "Usa al menos 12 caracteres",
                "Combina mayúsculas, minúsculas, números y símbolos",
                "Evita información personal (nombres, fechas de nacimiento)",
                "No reutilices contraseñas en diferentes servicios",
                "Cambia tu contraseña cada 3-6 meses"
            ],
            badPractices: [
                "123456", "password", "qwerty",
                "fechas de nacimiento",
                "nombres de mascotas",
                "palabras del diccionario"
            ]
        },
        {
            id: 3,
            title: "Privacidad de la información",
            description: "Controla quién puede ver tu información",
            icon: "🛡️",
            settings: [
                {
                    name: "Última vez y en línea",
                    description: "Controla quién puede ver cuándo estuviste activo",
                    options: ["Todos", "Mis contactos", "Nadie"]
                },
                {
                    name: "Foto de perfil",
                    description: "Quién puede ver tu foto de perfil",
                    options: ["Todos", "Mis contactos", "Nadie"]
                },
                {
                    name: "Bio / Estado",
                    description: "Quién puede ver tu biografía",
                    options: ["Todos", "Mis contactos", "Nadie"]
                }
            ],
            recommendations: [
                "Revisa tu configuración de privacidad regularmente",
                "Solo comparte información necesaria",
                "Configura tu perfil como 'Solo contactos' para mayor privacidad"
            ]
        },
        {
            id: 4,
            title: "Dispositivos conectados",
            description: "Gestiona los dispositivos con acceso a tu cuenta",
            icon: "💻",
            steps: [
                "Ve a 'Privacidad y Seguridad'",
                "Selecciona 'Dispositivos conectados'",
                "Revisa la lista de dispositivos activos",
                "Identifica dispositivos desconocidos",
                "Cierra sesión de dispositivos no reconocidos"
            ],
            warning: "Si identificas un dispositivo desconocido, cambia tu contraseña inmediatamente y cierra todas las sesiones."
        },
        {
            id: 5,
            title: "Reportar actividad sospechosa",
            description: "Qué hacer si detectas comportamiento inusual",
            icon: "🚨",
            steps: [
                "Cambia tu contraseña inmediatamente",
                "Revisa los dispositivos conectados",
                "Contacta a soporte técnico",
                "Proporciona detalles de la actividad sospechosa",
                "Sigue las instrucciones del equipo de seguridad"
            ],
            contact: "soporte@chatapp.com"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                        ← Volver a Ayuda
                    </button>
                    <h2 className="text-xl font-bold">Seguridad y Privacidad</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6 max-w-5xl mx-auto">
                {/* Banner de seguridad */}
                <div className="mb-8 p-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">🛡️</div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Tu seguridad es nuestra prioridad</h3>
                            <p className="text-gray-300">
                                Implementamos encriptación de extremo a extremo y las mejores prácticas de seguridad
                                para proteger tus conversaciones.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid de temas de seguridad */}
                <div className="space-y-6">
                    {securityTopics.map(topic => (
                        <div key={topic.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-green-500/50 transition">
                            {/* Header del tema */}
                            <div className="p-6 border-b border-slate-700 bg-slate-800/80">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{topic.icon}</div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">{topic.title}</h3>
                                                {topic.status === 'coming-soon' && (
                                                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full">
                                                        Próximamente
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-400">{topic.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                {/* Pasos */}
                                {topic.steps && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                                            📋 Pasos a seguir:
                                        </h4>
                                        <ol className="space-y-2">
                                            {topic.steps.map((step, index) => (
                                                <li key={index} className="flex items-start gap-3 text-gray-300">
                                                    <span className="w-6 h-6 rounded-full bg-green-600/20 text-green-400 flex items-center justify-center text-sm flex-shrink-0">
                                                        {index + 1}
                                                    </span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {/* Beneficios */}
                                {topic.benefits && (
                                    <div className="mb-6 p-4 bg-blue-600/10 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                            ✅ Beneficios:
                                        </h4>
                                        <ul className="space-y-1">
                                            {topic.benefits.map((benefit, index) => (
                                                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                                    <span className="text-blue-400">•</span>
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Tips de contraseñas */}
                                {topic.tips && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                                            💪 Consejos para contraseñas seguras:
                                        </h4>
                                        <ul className="space-y-2">
                                            {topic.tips.map((tip, index) => (
                                                <li key={index} className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-green-400">✓</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Malas prácticas */}
                                {topic.badPractices && (
                                    <div className="mb-6 p-4 bg-red-500/10 rounded-lg">
                                        <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                                            ❌ Evita usar:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {topic.badPractices.map((practice, index) => (
                                                <span key={index} className="bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-full">
                                                    {practice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Configuración de privacidad */}
                                {topic.settings && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                            ⚙️ Configuración recomendada:
                                        </h4>
                                        <div className="space-y-3">
                                            {topic.settings.map((setting, index) => (
                                                <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                                                    <p className="font-medium mb-1">{setting.name}</p>
                                                    <p className="text-xs text-gray-400 mb-2">{setting.description}</p>
                                                    <div className="flex gap-2">
                                                        {setting.options.map((option, optIndex) => (
                                                            <span key={optIndex} className="bg-slate-700 text-xs px-3 py-1.5 rounded-full">
                                                                {option}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recomendaciones */}
                                {topic.recommendations && (
                                    <div className="mb-6 p-4 bg-purple-600/10 rounded-lg">
                                        <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                            💡 Recomendaciones:
                                        </h4>
                                        <ul className="space-y-1">
                                            {topic.recommendations.map((rec, index) => (
                                                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                                    <span className="text-purple-400">•</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Advertencia */}
                                {topic.warning && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                                            ⚠️ Importante:
                                        </h4>
                                        <p className="text-sm text-gray-300">{topic.warning}</p>
                                    </div>
                                )}

                                {/* Contacto */}
                                {topic.contact && (
                                    <div className="bg-slate-700/20 p-4 rounded-lg">
                                        <p className="text-sm text-gray-300">
                                            📧 Para reportar actividad sospechosa: {' '}
                                            <a href={`mailto:${topic.contact}`} className="text-blue-400 hover:text-blue-300">
                                                {topic.contact}
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex justify-between items-center">
                                <div className="flex gap-2">
                                    {topic.status !== 'coming-soon' && (
                                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition flex items-center gap-2">
                                            🔒 Configurar ahora
                                        </button>
                                    )}
                                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition">
                                        📚 Más información
                                    </button>
                                </div>
                                <span className="text-xs text-gray-500">
                                    Última actualización: Febrero 2026
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checklist de seguridad */}
                <div className="mt-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        ✅ Checklist de seguridad personal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-green-500" />
                            <span className="text-sm text-gray-300">Cambié mi contraseña en los últimos 3 meses</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-green-500" />
                            <span className="text-sm text-gray-300">Activé la autenticación de dos factores</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-green-500" />
                            <span className="text-sm text-gray-300">Revisé mis dispositivos conectados</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-green-500" />
                            <span className="text-sm text-gray-300">Configuré mi privacidad en "Solo contactos"</span>
                        </div>
                    </div>
                </div>

                {/* Contacto de seguridad */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400">
                        ¿Encontraste una vulnerabilidad? Contacta a nuestro equipo de seguridad:{' '}
                        <a href="mailto:security@chatapp.com" className="text-blue-400 hover:text-blue-300">
                            security@chatapp.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpSecurityPrivacy;