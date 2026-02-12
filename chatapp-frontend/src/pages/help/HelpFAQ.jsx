import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HelpFAQ = ({ onBack }) => {
    const [faqItems, setFaqItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFaq();
    }, []);

    const loadFaq = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/support/faq');
            setFaqItems(response.data);
        } catch (error) {
            console.error('Error cargando FAQ:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFaq = faqItems.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <div className="bg-slate-800 p-4 shadow-md flex items-center justify-between border-b border-slate-700">
                <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2">
                    ← Volver a Ayuda
                </button>
                <h2 className="text-xl font-bold">Preguntas Frecuentes</h2>
                <div className="w-10"></div>
            </div>

            <div className="p-6 max-w-4xl mx-auto">
                {/* Buscador */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Buscar en preguntas frecuentes..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">🔍</div>
                </div>

                {/* Contenido FAQ */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4 animate-pulse">❓</div>
                        <p className="text-gray-400">Cargando preguntas frecuentes...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredFaq.length === 0 ? (
                            <div className="text-center py-12 bg-slate-800 rounded-lg">
                                <div className="text-4xl mb-4">🔍</div>
                                <p className="text-gray-400">No se encontraron resultados para "{searchTerm}"</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-blue-400 hover:text-blue-300"
                                >
                                    Limpiar búsqueda
                                </button>
                            </div>
                        ) : (
                            filteredFaq.map((item, index) => (
                                <div key={item.id || index} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition">
                                    <div className="flex items-start gap-3">
                                        <span className="text-blue-400 mt-1">❓</span>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-2">{item.question}</h3>
                                            <p className="text-gray-300 mb-3">{item.answer}</p>
                                            <span className="inline-block bg-slate-700 text-xs px-3 py-1 rounded-full">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Pie de página */}
                <div className="mt-8 p-6 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-gray-400">
                        ¿No encuentras lo que buscas?{' '}
                        <button
                            onClick={() => window.location.href = '#contact'}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Contacta con soporte
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpFAQ;