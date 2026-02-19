import React, { useState } from 'react';
import axios from 'axios';

const AccountSettings = ({ user, onBack }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.newPassword !== formData.confirmPassword) {
            setError('La nueva contraseña y su confirmación no coinciden');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await axios.post(`http://localhost:8081/api/auth/users/${user.id}/change-password`, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });
            setSuccess(true);
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                setError('La contraseña actual es incorrecta');
            } else {
                setError('Error al cambiar la contraseña');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">

                <h2 className="text-2xl font-bold text-white mb-6 text-center">Ajustes de Cuenta</h2>

                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-500/20 text-green-400 p-3 rounded mb-4 text-sm">Contraseña cambiada con éxito.</div>}

                {/* Sección Cambiar Contraseña */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-600 pb-2">Cambiar Contraseña</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña Actual</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nueva Contraseña</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-2"
                        >
                            Actualizar Contraseña
                        </button>
                    </form>
                </div>

                <button
                    onClick={onBack}
                    className="w-full bg-transparent text-gray-400 hover:text-white font-medium py-2 px-4 rounded border border-slate-600 transition"
                >
                    Volver
                </button>
            </div>
        </div>
    );
};

export default AccountSettings;