import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HelpSupport = ({ onBack, user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [faqItems, setFaqItems] = useState([]);
    const [termsContent, setTermsContent] = useState(null);
    const [privacyContent, setPrivacyContent] = useState(null);

    const [contactForm, setContactForm] = useState({
        name: user?.username || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    // Cargar FAQ al abrir el modal
    useEffect(() => {
        if (showFaqModal && faqItems.length === 0) {
            loadFaq();
        }
    }, [showFaqModal]);

    const loadFaq = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/support/faq');
            setFaqItems(response.data);
        } catch (error) {
            console.error('Error cargando FAQ:', error);
        }
    };

    const loadTerms = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/support/terms');
            setTermsContent(response.data);
        } catch (error) {
            console.error('Error cargando términos:', error);
        }
    };

    const loadPrivacy = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/support/privacy');
            setPrivacyContent(response.data);
        } catch (error) {
            console.error('Error cargando política de privacidad:', error);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            const requestData = {
                ...contactForm,
                userId: user?.id || null
            };

            const response = await axios.post('http://localhost:8081/api/support/contact', requestData);

            setSubmitMessage({
                type: 'success',
                text: `¡Gracias ${contactForm.name}! Hemos recibido tu consulta (#${response.data.id}). Te contactaremos en ${contactForm.email} pronto.`
            });

            // Limpiar formulario
            setContactForm({
                name: user?.username || '',
                email: user?.email || '',
                subject: '',
                message: ''
            });

            // Cerrar modal después de 3 segundos
            setTimeout(() => {
                setShowContactModal(false);
                setSubmitMessage({ type: '', text: '' });
            }, 3000);

        } catch (error) {
            console.error('Error enviando consulta:', error);
            setSubmitMessage({
                type: 'error',
                text: 'Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContactChange = (e) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value
        });
    };

    const handleFaqClick = () => {
        setShowFaqModal(true);
        if (faqItems.length === 0) {
            loadFaq();
        }
    };

    const handleTermsClick = () => {
        setShowTermsModal(true);
        if (!termsContent) {
            loadTerms();
        }
    };

    const handlePrivacyClick = () => {
        setShowPrivacyModal(true);
        if (!privacyContent) {
            loadPrivacy();
        }
    };

    const filteredFaq = faqItems.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                        <button
                            onClick={handleFaqClick}
                            className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700"
                        >
                            <div className="text-4xl mb-2">❓</div>
                            <span className="font-medium">Preguntas Frecuentes</span>
                        </button>

                        <button
                            onClick={() => setShowContactModal(true)}
                            className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700"
                        >
                            <div className="text-4xl mb-2">🎧</div>
                            <span className="font-medium">Contactar con Soporte</span>
                        </button>

                        <button
                            onClick={handleTermsClick}
                            className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition flex flex-col items-center text-center border border-slate-700"
                        >
                            <div className="text-4xl mb-2">📜</div>
                            <span className="font-medium">Términos y Privacidad</span>
                        </button>

                    </div>
                </div>

                {/* Categorías Populares */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Categorías Populares</h3>
                    <div className="bg-slate-800 rounded-lg shadow border border-slate-700 overflow-hidden">

                        <div
                            onClick={handleFaqClick}
                            className="p-4 border-b border-slate-700 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-blue-400">👤</span>
                                <div>
                                    <p className="font-medium">Gestión de Cuenta</p>
                                    <p className="text-xs text-gray-400">Perfil, Privacidad, Seguridad</p>
                                </div>
                            </div>
                            <span>→</span>
                        </div>

                        <div
                            onClick={() => setShowContactModal(true)}
                            className="p-4 border-b border-slate-700 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-green-400">🔒</span>
                                <div>
                                    <p className="font-medium">Seguridad y Privacidad</p>
                                    <p className="text-xs text-gray-400">Contraseñas, 2FA, Datos</p>
                                </div>
                            </div>
                            <span>→</span>
                        </div>

                        <div
                            onClick={() => setShowContactModal(true)}
                            className="p-4 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition"
                        >
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

            {/* MODAL: Preguntas Frecuentes */}
            {showFaqModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Preguntas Frecuentes</h3>
                            <button
                                onClick={() => setShowFaqModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Buscar en FAQ..."
                                className="w-full p-3 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {filteredFaq.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <div className="text-4xl mb-4">🤔</div>
                                    <p>Cargando preguntas frecuentes...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredFaq.map((item, index) => (
                                        <div key={item.id || index} className="border-b border-slate-700 pb-4 last:border-0">
                                            <div className="flex items-start gap-3">
                                                <span className="text-blue-400 mt-1">❓</span>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg mb-2">{item.question}</h4>
                                                    <p className="text-gray-300 mb-2">{item.answer}</p>
                                                    <span className="inline-block bg-slate-700 text-xs px-3 py-1 rounded-full">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-700 text-center">
                            <p className="text-sm text-gray-400">
                                ¿No encuentras lo que buscas?{' '}
                                <button
                                    onClick={() => {
                                        setShowFaqModal(false);
                                        setShowContactModal(true);
                                    }}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Contacta con soporte
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Contactar con Soporte */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Contactar con Soporte</h3>
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6">
                            {submitMessage.text && (
                                <div className={`p-4 rounded-lg mb-6 ${submitMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {submitMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={contactForm.name}
                                            onChange={handleContactChange}
                                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={contactForm.email}
                                            onChange={handleContactChange}
                                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Asunto *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={contactForm.subject}
                                        onChange={handleContactChange}
                                        placeholder="Ej: Problema con inicio de sesión"
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Mensaje *</label>
                                    <textarea
                                        name="message"
                                        value={contactForm.message}
                                        onChange={handleContactChange}
                                        rows="6"
                                        placeholder="Describe tu problema o consulta con detalle..."
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white resize-none"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowContactModal(false)}
                                        disabled={isSubmitting}
                                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded transition disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 pt-6 border-t border-slate-700">
                                <h4 className="font-medium mb-3 text-blue-400">📞 Otras formas de contacto</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <div className="text-2xl mb-2">📧</div>
                                        <p className="font-medium text-sm">Email</p>
                                        <p className="text-xs text-gray-400">soporte@chatapp.com</p>
                                    </div>
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <div className="text-2xl mb-2">🕐</div>
                                        <p className="font-medium text-sm">Horario</p>
                                        <p className="text-xs text-gray-400">Lun-Vie 9:00-18:00</p>
                                    </div>
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <div className="text-2xl mb-2">⏱️</div>
                                        <p className="font-medium text-sm">Respuesta</p>
                                        <p className="text-xs text-gray-400">24-48 horas hábiles</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Términos y Privacidad */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleTermsClick}
                                    className={`px-4 py-2 rounded ${!showPrivacyModal ? 'bg-blue-600' : 'bg-slate-700'}`}
                                >
                                    Términos y Condiciones
                                </button>
                                <button
                                    onClick={handlePrivacyClick}
                                    className={`px-4 py-2 rounded ${showPrivacyModal ? 'bg-blue-600' : 'bg-slate-700'}`}
                                >
                                    Política de Privacidad
                                </button>
                            </div>
                            <button
                                onClick={() => setShowTermsModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {!showPrivacyModal ? (
                                termsContent ? (
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">{termsContent.title}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Última actualización: {new Date(termsContent.lastUpdated).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="bg-slate-700 text-xs px-3 py-1 rounded-full">
                                                v{termsContent.version}
                                            </span>
                                        </div>
                                        <div
                                            className="prose prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: termsContent.content }}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">📜</div>
                                        <p className="text-gray-400">Cargando términos y condiciones...</p>
                                    </div>
                                )
                            ) : (
                                privacyContent ? (
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">{privacyContent.title}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Última actualización: {new Date(privacyContent.lastUpdated).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="bg-slate-700 text-xs px-3 py-1 rounded-full">
                                                v{privacyContent.version}
                                            </span>
                                        </div>
                                        <div
                                            className="prose prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: privacyContent.content }}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">🔒</div>
                                        <p className="text-gray-400">Cargando política de privacidad...</p>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-700 text-center">
                            <button
                                onClick={() => setShowTermsModal(false)}
                                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpSupport;