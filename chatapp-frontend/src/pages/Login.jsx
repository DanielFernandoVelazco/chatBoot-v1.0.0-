import React, { useState } from 'react';
import axios from 'axios'; // Lo usaremos más adelante, lo preparamos ahora

const Login = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí irá la lógica de autenticación (Próximos pasos)
            console.log("Intentando login con:", formData);
            alert("Función de login conectada. Próximo paso: Backend de autenticación.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">ChatApp</h1>
                    <h2 className="text-xl font-medium text-gray-300">Bienvenido de nuevo</h2>
                    <p className="text-sm text-gray-500">Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email o Usuario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Correo electrónico o nombre de usuario
                        </label>
                        <input
                            type="text"
                            name="emailOrUsername"
                            value={formData.emailOrUsername}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="ej: tu@email.com"
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Contraseña
                            </label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300">¿Olvidaste tu contraseña?</a>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="Introduce tu contraseña"
                            required
                        />
                    </div>

                    {/* Recordarme */}
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-slate-700"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                            Recordarme
                        </label>
                    </div>

                    {/* Botón Iniciar Sesión */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">o</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* Botón Google */}
                <button
                    type="button"
                    className="w-full bg-transparent border border-gray-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-center gap-2"
                >
                    <span>Continuar con Google</span>
                </button>

                <div className="mt-6 text-center">
                    <span className="text-sm text-gray-400">¿No tienes una cuenta? </span>
                    <button
                        onClick={onToggle}
                        className="text-sm text-blue-400 hover:text-blue-300 font-semibold"
                    >
                        Regístrate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;