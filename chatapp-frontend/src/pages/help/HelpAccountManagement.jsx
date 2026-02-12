import React from 'react';

const HelpAccountManagement = ({ onBack, user }) => {
    const articles = [
        {
            id: 1,
            title: "Crear una cuenta",
            description: "Aprende a registrarte en ChatApp de forma rápida y sencilla",
            icon: "📝",
            steps: [
                "Ve a la pantalla de inicio y haz clic en 'Regístrate'",
                "Completa el formulario con tu nombre, email y contraseña",
                "Acepta los términos y condiciones",
                "Haz clic en 'Crear Cuenta'",
                "¡Listo! Ya puedes iniciar sesión"
            ],
            tips: ["Usa una contraseña segura", "Verifica tu correo electrónico"]
        },
        {
            id: 2,
            title: "Editar perfil",
            description: "Cómo actualizar tu foto, nombre y biografía",
            icon: "✏️",
            steps: [
                "Haz clic en tu avatar en la esquina superior izquierda",
                "Selecciona 'Editar Perfil'",
                "Modifica los campos que desees (nombre, bio, foto)",
                "Haz clic en 'Guardar Cambios'"
            ],
            tips: ["La foto de perfil debe ser cuadrada para mejor visualización", "Tu bio puede tener hasta 500 caracteres"]
        },
        {
            id: 3,
            title: "Cambiar contraseña",
            description: "Mantén tu cuenta segura actualizando tu contraseña regularmente",
            icon: "🔒",
            steps: [
                "Ve a 'Editar Perfil' desde el menú principal",
                "Haz clic en 'Ajustes de Cuenta'",
                "Selecciona la sección 'Cambiar Contraseña'",
                "Ingresa tu contraseña actual",
                "Ingresa y confirma tu nueva contraseña",
                "Haz clic en 'Actualizar Contraseña'"
            ],
            requirements: ["Mínimo 6 caracteres", "No debe ser igual a la anterior"],
            tips: ["Cambia tu contraseña cada 3 meses", "No uses la misma contraseña en otros servicios"]
        },
        {
            id: 4,
            title: "Cerrar sesión",
            description: "Cómo salir de tu cuenta de forma segura",
            icon: "🚪",
            steps: [
                "Haz clic en tu avatar en la esquina superior izquierda",
                "Haz clic en el botón de cerrar sesión (🚪)",
                "Confirmar la acción"
            ],
            tips: ["Siempre cierra sesión en dispositivos compartidos"]
        },
        {
            id: 5,
            title: "Eliminar cuenta",
            description: "Solicita la eliminación permanente de tu cuenta",
            icon: "⚠️",
            steps: [
                "Contacta con soporte técnico",
                "Envía una solicitud de eliminación de cuenta",
                "Confirma tu identidad",
                "Espera la confirmación por correo"
            ],
            warning: "Esta acción es irreversible. Todos tus mensajes y datos serán eliminados permanentemente.",
            tips: ["Descarga tu historial de chats antes de eliminar tu cuenta"]
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
                    <h2 className="text-xl font-bold">Gestión de Cuenta</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6 max-w-5xl mx-auto">
                {/* Estado de cuenta actual */}
                {user && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold border-2 border-blue-400">
                                {user.username?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Tu cuenta actual</h3>
                                <p className="text-gray-300">{user.username}</p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                                <span className="inline-block mt-2 bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                                    Cuenta activa
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid de artículos */}
                <div className="space-y-6">
                    {articles.map(article => (
                        <div key={article.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500/50 transition">
                            {/* Header del artículo */}
                            <div className="p-6 border-b border-slate-700 bg-slate-800/80">
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">{article.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                                        <p className="text-gray-400">{article.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                {/* Pasos */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                        📋 Pasos a seguir:
                                    </h4>
                                    <ol className="space-y-2">
                                        {article.steps.map((step, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-300">
                                                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {/* Requisitos (si aplica) */}
                                {article.requirements && (
                                    <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
                                        <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                                            ⚡ Requisitos:
                                        </h4>
                                        <ul className="space-y-1">
                                            {article.requirements.map((req, index) => (
                                                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                                    <span className="text-yellow-400">•</span>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Advertencia (si aplica) */}
                                {article.warning && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                                            ⚠️ Advertencia:
                                        </h4>
                                        <p className="text-sm text-gray-300">{article.warning}</p>
                                    </div>
                                )}

                                {/* Tips */}
                                <div className="bg-slate-700/20 p-4 rounded-lg">
                                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                                        💡 Consejos:
                                    </h4>
                                    <ul className="space-y-1">
                                        {article.tips.map((tip, index) => (
                                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="text-green-400">•</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Footer con acciones rápidas */}
                            <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex flex-wrap gap-3">
                                {article.title === "Editar perfil" && (
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition flex items-center gap-2">
                                        ✏️ Ir a Editar Perfil
                                    </button>
                                )}
                                {article.title === "Cambiar contraseña" && (
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition flex items-center gap-2">
                                        🔒 Cambiar Contraseña
                                    </button>
                                )}
                                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition flex items-center gap-2">
                                    📤 Compartir artículo
                                </button>
                                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition flex items-center gap-2">
                                    🔖 Guardar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sección de ayuda adicional */}
                <div className="mt-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">❓</div>
                            <div>
                                <h4 className="font-semibold">¿No encuentras lo que buscas?</h4>
                                <p className="text-sm text-gray-400">Nuestro equipo de soporte está listo para ayudarte</p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = '#contact'}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
                        >
                            🎧 Contactar Soporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpAccountManagement;