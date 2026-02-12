import React, { useState } from 'react';
import axios from 'axios';

const HelpContact = ({ onBack, user }) => {
    const [contactForm, setContactForm] = useState({
        name: user?.username || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [ticketCreated, setTicketCreated] = useState(null);

    const handleChange = (e) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value
        });
        // Limpiar mensaje de estado al escribir
        if (submitStatus.message) {
            setSubmitStatus({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: '', message: '' });

        try {
            const requestData = {
                ...contactForm,
                userId: user?.id || null
            };

            const response = await axios.post('http://localhost:8081/api/support/contact', requestData);

            setTicketCreated(response.data);
            setSubmitStatus({
                type: 'success',
                message: `¡Gracias ${contactForm.name}! Hemos recibido tu consulta (#${response.data.id})`
            });

            // No limpiar el formulario inmediatamente para mostrar el éxito
            setTimeout(() => {
                setTicketCreated(null);
                // Opcional: volver atrás después de 3 segundos
                // onBack();
            }, 5000);

        } catch (error) {
            console.error('Error enviando consulta:', error);
            setSubmitStatus({
                type: 'error',
                message: 'Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setContactForm({
            name: user?.username || '',
            email: user?.email || '',
            subject: '',
            message: ''
        });
        setSubmitStatus({ type: '', message: '' });
        setTicketCreated(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 shadow-md flex items-center justify-between border-b border-slate-700 sticky top-0 z-10">
                <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                    ← Volver a Ayuda
                </button>
                <h2 className="text-xl font-bold">Contactar con Soporte</h2>
                <div className="w-10"></div>
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                {/* Mensaje de éxito */}
                {submitStatus.type === 'success' && ticketCreated && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-green-400 mb-2">¡Consulta enviada con éxito!</h3>
                        <p className="text-gray-300 mb-4">{submitStatus.message}</p>
                        <div className="bg-slate-800 rounded-lg p-4 mb-4 text-left">
                            <p className="text-sm text-gray-400">Número de ticket: <span className="text-white font-mono">#{ticketCreated.id}</span></p>
                            <p className="text-sm text-gray-400">Estado: <span className="text-yellow-400">{ticketCreated.status}</span></p>
                            <p className="text-sm text-gray-400">Fecha: {new Date(ticketCreated.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={resetForm}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                            >
                                Enviar otra consulta
                            </button>
                            <button
                                onClick={onBack}
                                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
                            >
                                Volver a Ayuda
                            </button>
                        </div>
                    </div>
                )}

                {/* Formulario de contacto */}
                {submitStatus.type !== 'success' && (
                    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">🎧</div>
                                <div>
                                    <h3 className="text-lg font-semibold">¿Necesitas ayuda?</h3>
                                    <p className="text-sm text-gray-400">Completa el formulario y te responderemos en 24-48 horas</p>
                                </div>
                            </div>
                        </div>

                        {submitStatus.type === 'error' && (
                            <div className="m-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                                ⚠️ {submitStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nombre completo <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                        placeholder="Ej: Juan Pérez"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Correo electrónico <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                        placeholder="ej: usuario@email.com"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Asunto <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={contactForm.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    placeholder="Ej: Problema con el inicio de sesión"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Mensaje <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                                    placeholder="Describe tu problema o consulta con el mayor detalle posible..."
                                    required
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    {contactForm.message.length}/2000 caracteres
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Enviando consulta...
                                        </>
                                    ) : (
                                        <>
                                            📨 Enviar consulta
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={onBack}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Información adicional de contacto */}
                <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                        📋 Otras formas de contacto
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 hover:border-blue-500/50 transition">
                            <div className="text-3xl mb-3">📧</div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-gray-400 mt-1">soporte@chatapp.com</p>
                            <p className="text-xs text-gray-500 mt-2">Respuesta en 24-48h</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 hover:border-blue-500/50 transition">
                            <div className="text-3xl mb-3">🕐</div>
                            <p className="font-medium">Horario de atención</p>
                            <p className="text-sm text-gray-400 mt-1">Lunes a Viernes</p>
                            <p className="text-sm text-gray-400">9:00 AM - 6:00 PM</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 hover:border-blue-500/50 transition">
                            <div className="text-3xl mb-3">💬</div>
                            <p className="font-medium">Chat en vivo</p>
                            <p className="text-sm text-gray-400 mt-1">Próximamente</p>
                            <p className="text-xs text-gray-500 mt-2">Disponible 24/7</p>
                        </div>
                    </div>
                </div>

                {/* Preguntas frecuentes relacionadas */}
                <div className="mt-8 p-6 bg-slate-800/30 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        ❓ ¿Buscas respuestas rápidas?
                    </h4>
                    <p className="text-sm text-gray-400 mb-3">
                        Quizás puedas encontrar solución en nuestras preguntas frecuentes
                    </p>
                    <button
                        onClick={() => window.location.href = '#faq'}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                    >
                        Ver preguntas frecuentes →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpContact;