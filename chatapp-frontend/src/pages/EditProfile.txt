import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = ({ user, onSave, onAccountSettings, onBack }) => {
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        profilePhotoUrl: ''
    });
    const [error, setError] = useState('');

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                bio: user.bio || '',
                profilePhotoUrl: user.profilePhotoUrl || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.put(`http://localhost:8081/api/auth/users/${user.id}`, formData);
            alert('Perfil actualizado correctamente');
            onSave(response.data); // Actualizar usuario en App.jsx
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                setError('Error al actualizar perfil. El nombre de usuario podría estar en uso.');
            } else {
                setError('Hubo un error de conexión con el servidor.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">

                <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Perfil</h2>

                {/* Vista Previa del Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-3xl overflow-hidden mb-2 relative">
                        {formData.profilePhotoUrl ? (
                            <img src={formData.profilePhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.username.substring(0, 2).toUpperCase()
                        )}
                    </div>
                    <p className="text-xs text-gray-400">Foto de Perfil</p>
                </div>

                {error && <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Estado / Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            placeholder="Escribe algo sobre ti..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">URL de Foto (Opcional)</label>
                        <input
                            type="url"
                            name="profilePhotoUrl"
                            value={formData.profilePhotoUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            placeholder="https://..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
                    >
                        Guardar Cambios
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full bg-transparent text-gray-400 hover:text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                        Cancelar
                    </button>
                </form>

                {/* Enlace a Ajustes de Cuenta */}
                <div className="mt-6 border-t border-slate-700 pt-4">
                    <button
                        onClick={onAccountSettings}
                        className="w-full text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 py-2 rounded hover:bg-slate-700 transition"
                    >
                        ⚙️ Ir a Ajustes de Cuenta y Seguridad
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditProfile;