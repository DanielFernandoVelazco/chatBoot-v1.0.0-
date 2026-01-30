import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MainChat = ({ user, onLogout, onEditProfile }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedContactName, setSelectedContactName] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const API_URL = 'http://localhost:8081';

    // 1. Cargar Contactos al montar el componente
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/users`);
                const allUsers = response.data;

                // Filtramos para no mostrarnos a nosotros mismos en la lista
                const otherUsers = allUsers.filter(u => u.id !== user.id);
                setContacts(otherUsers);

                // Seleccionar automáticamente el primer contacto si existe
                if (otherUsers.length > 0) {
                    selectContact(otherUsers[0]);
                }
            } catch (error) {
                console.error("Error cargando contactos", error);
            }
        };

        fetchContacts();
    }, [user.id]);

    // 2. Función para seleccionar un contacto y cargar su chat
    const selectContact = (contact) => {
        setSelectedContactId(contact.id);
        setSelectedContactName(contact.username);
        loadMessages(user.id, contact.id);
    };

    // 3. Cargar mensajes de la conversación
    const loadMessages = async (id1, id2) => {
        try {
            const response = await axios.get(`${API_URL}/api/messages/conversation`, {
                params: { userId1: id1, userId2: id2 }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error cargando mensajes", error);
        }
    };

    // 4. Enviar Mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedContactId) return;

        const tempId = Date.now();

        // Optimista: Mostramos el mensaje inmediatamente antes de esperar respuesta
        const newMessage = {
            id: tempId,
            senderId: user.id,
            content: messageInput,
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, newMessage]);
        setMessageInput("");

        try {
            await axios.post(`${API_URL}/api/messages/send`, {
                senderId: user.id,
                receiverId: selectedContactId,
                content: messageInput
            });
            // Aquí podríamos hacer un 'loadMessages' para actualizar el ID real,
            // pero para esta demo es suficiente.
            console.log("Mensaje enviado");
        } catch (error) {
            console.error("Error enviando mensaje", error);
            // Si falla, podríamos quitar el mensaje optimista
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">

            {/* BARRA LATERAL */}
            <div className="w-80 flex flex-col border-r border-slate-700 bg-slate-800">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold">{user.username}</span>
                    </div>
                    {/* CAMBIO AQUÍ: */}
                    <button
                        onClick={onEditProfile}
                        className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600 text-lg"
                    >
                        ⚙️
                    </button>
                </div>

                {/* Lista de Contactos (Real) */}
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => selectContact(contact)}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition ${
                                selectedContactId === contact.id ? 'bg-slate-700 border-l-4 border-blue-500' : ''
                            }`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                                    {contact.username.charAt(0)}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{contact.username}</h4>
                                <p className="text-sm text-gray-400">Click para ver chat</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* VENTANA DE CHAT */}
            <div className="flex-1 flex flex-col bg-slate-900">
                {selectedContactId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                                    {selectedContactName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{selectedContactName}</h2>
                                    <span className="text-xs text-green-400">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Área de Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">Envía el primer mensaje...</div>
                            )}

                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                        msg.senderId === user.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-700 text-gray-200'
                                    }`}>
                                        <p>{msg.content}</p>
                                        <div className={`text-[10px] mt-1 text-right ${
                                            msg.senderId === user.id ? 'text-blue-200' : 'text-gray-500'
                                        }`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-700 bg-slate-800">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 px-4 transition">
                                    ➤
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Selecciona un contacto para chatear
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainChat;