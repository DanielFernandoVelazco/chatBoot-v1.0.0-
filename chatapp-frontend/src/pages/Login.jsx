import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Limpiar error al escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                email: formData.email, // Asegúrate de usar email para buscar
                password: formData.password
            });

            alert(`Bienvenido de nuevo, ${response.data.username}!`);
            console.log("Usuario logueado:", response.data);
            // Aquí guardaremos el usuario en el contexto más adelante

        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                setError('Credenciales incorrectas');
            } else {
                setError('Ocurrió un error al intentar iniciar sesión');
            }
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

                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="ej: fernando@chatapp.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="********"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </form>

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