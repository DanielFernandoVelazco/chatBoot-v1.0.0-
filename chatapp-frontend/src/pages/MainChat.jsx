import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const MainChat = ({ user, onLogout, onEditProfile, onAccountSettings, onHelp }) => {

    // --- ESTADOS ---
    const [contacts, setContacts] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedContactName, setSelectedContactName] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatMode, setChatMode] = useState('human');
    const [isConnected, setIsConnected] = useState(false);

    // --- REFs ---
    const fileInputRef = useRef(null);
    const activeContactRef = useRef(null);
    const stompClientRef = useRef(null);
    const stompConnectedRef = useRef(false);
    const isMountedRef = useRef(false);
    const isConnectingRef = useRef(false);
    const processedMessageIds = useRef(new Set()); // NUEVO: Set para IDs procesados

    const API_URL = 'http://localhost:8081';

    // --- FUNCIONES DE LÓGICA DEL CHAT ---

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

    const selectContact = (contact) => {
        const contactId = contact.id;
        activeContactRef.current = contactId;
        setSelectedContactId(contactId);
        setSelectedContactName(contact.username);
        loadMessages(user.id, contactId);
        // Limpiar Set de mensajes procesados al cambiar de contacto
        processedMessageIds.current.clear();
    };

    const sendMessageImage = async (content) => {
        if (!content || !content.trim()) return;
        if (!activeContactRef.current) return;

        // Generar ID temporal único
        const tempId = `temp-${Date.now()}-${Math.random()}`;

        if (chatMode === 'ai') {
            // MODO IA
            try {
                const tempMessage = {
                    id: tempId,
                    senderId: -1,
                    senderName: 'Asistente AI',
                    content: content,
                    timestamp: new Date().toISOString(),
                    isTemp: true // Marcar como temporal
                };

                // Agregar mensaje temporal del usuario
                const userTempMessage = {
                    id: `temp-user-${Date.now()}`,
                    senderId: user.id,
                    senderName: user.username,
                    content: content,
                    timestamp: new Date().toISOString(),
                    isTemp: true
                };
                setMessages(prev => [...prev, userTempMessage]);
                setMessageInput("");

                const response = await axios.post(`${API_URL}/api/ai/chat`, {
                    message: content
                });

                const aiMessage = {
                    id: `ai-${Date.now()}`,
                    senderId: -1,
                    senderName: 'Asistente AI',
                    content: response.data.content,
                    timestamp: new Date().toISOString()
                };

                // Reemplazar mensaje temporal con el real de la IA
                setMessages(prev => prev.filter(msg => msg.id !== userTempMessage.id).concat([aiMessage]));

            } catch (error) {
                console.error("Error en la IA:", error);
                alert("Error de IA: " + (error.response?.data?.error || error.message));
                // Eliminar mensaje temporal en caso de error
                setMessages(prev => prev.filter(msg => msg.id !== tempId));
            }
        } else {
            // MODO HUMANO - CORREGIDO: Sin duplicación
            try {
                // 1. NO agregamos mensaje optimista aquí - esperamos confirmación del WebSocket

                // 2. Enviar al backend
                const response = await axios.post(`${API_URL}/api/messages/send`, {
                    senderId: user.id,
                    receiverId: activeContactRef.current,
                    content: content
                });

                // 3. El mensaje llegará por WebSocket, NO lo agregamos manualmente
                setMessageInput("");

            } catch (error) {
                console.error("Error enviando mensaje:", error);
                alert("Error al enviar mensaje");
            }
        }
    };

    // --- INTERFAZ DE USUARIO ---
    const handleEmojiClick = (emoji) => {
        setMessageInput((prev) => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                sendMessageImage(reader.result);
            };
            reader.onerror = () => {
                alert('Error al leer la imagen');
            };
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        sendMessageImage(messageInput);
    };

    // --- EFECTOS ---

    // 1. Sincronizar Ref con Estado
    useEffect(() => {
        activeContactRef.current = selectedContactId;
    }, [selectedContactId]);

    // 2. Cargar Contactos
    useEffect(() => {
        const fetchContacts = async () => {
            if (!user || !user.id) return;
            try {
                const response = await axios.get(`${API_URL}/api/auth/users`);
                const allUsers = response.data;
                const otherUsers = allUsers.filter(u => u.id !== user.id);
                setContacts(otherUsers);
                if (otherUsers.length > 0) {
                    selectContact(otherUsers[0]);
                }
            } catch (error) {
                console.error("Error cargando contactos", error);
            }
        };
        fetchContacts();
    }, [user.id]);

    // 3. CONEXIÓN WEBSOCKET - CORREGIDO: Sin duplicación
    useEffect(() => {
        if (!user || !user.id) return;
        if (stompClientRef.current && stompConnectedRef.current) {
            console.log("Ya hay un WebSocket activo. Ignorando reconexión.");
            return;
        }

        console.log("Iniciando conexión WebSocket...");
        isConnectingRef.current = true;

        const socket = new SockJS('http://localhost:8081/ws-chat', null, { withCredentials: false });
        const client = Stomp.over(socket);
        client.debug = () => {};

        let subscription = null;
        isMountedRef.current = true;

        client.connect({}, () => {
            console.log('✅ Conectado al WebSocket');
            stompClientRef.current = client;
            stompConnectedRef.current = true;
            setIsConnected(true);

            // SUSCRIPCIÓN AL TOPICO GLOBAL DE MENSAJES
            subscription = client.subscribe('/topic/messages', (message) => {
                if (!isMountedRef.current) return;

                const newMessage = JSON.parse(message.body);
                const activeId = activeContactRef.current;

                // NUEVO: Evitar duplicados con Set
                const messageKey = `${newMessage.id}-${newMessage.timestamp}`;
                if (processedMessageIds.current.has(messageKey)) {
                    console.log("⏭️ Mensaje duplicado ignorado:", messageKey);
                    return;
                }

                // Marcar como procesado
                processedMessageIds.current.add(messageKey);

                // Limitar tamaño del Set (opcional)
                if (processedMessageIds.current.size > 100) {
                    const iterator = processedMessageIds.current.values();
                    processedMessageIds.current.delete(iterator.next().value);
                }

                const isForMe =
                    (newMessage.receiverId === user.id && activeId === newMessage.senderId) ||
                    (newMessage.senderId === user.id && activeId === newMessage.receiverId);

                if (isForMe) {
                    console.log("📨 Nuevo mensaje recibido:", newMessage);
                    setMessages(prev => {
                        // Verificar duplicado por ID
                        if (prev.some(msg => msg.id === newMessage.id && msg.timestamp === newMessage.timestamp)) {
                            return prev;
                        }
                        return [...prev, newMessage];
                    });
                }
            });

        }, (error) => {
            console.error("❌ Error conectando WebSocket", error);
            isConnectingRef.current = false;
            stompConnectedRef.current = false;
            setIsConnected(false);
        });

        // LIMPIEZA
        return () => {
            console.log("Desmontando WebSocket...");
            isMountedRef.current = false;
            isConnectingRef.current = false;

            if (subscription) {
                subscription.unsubscribe();
            }

            if (client && client.connected) {
                stompConnectedRef.current = false;
                setIsConnected(false);
                try { client.disconnect(); } catch(e){}
                stompClientRef.current = null;
            }
        };
    }, [user.id]);

    // --- RENDERIZADO ---
    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* --- BARRA LATERAL --- */}
            <div className="w-80 flex flex-col border-r border-slate-700 bg-slate-800">
                {/* HEADER */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold truncate">{user.username}</span>
                    </div>

                    <div className="flex gap-2">
                        {/* Indicador de conexión WebSocket */}
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mt-3`} title={isConnected ? 'Conectado' : 'Desconectado'}></div>

                        <button
                            onClick={onHelp}
                            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition"
                            title="Ayuda"
                        >
                            ❓
                        </button>
                        <button
                            onClick={onLogout}
                            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600 text-red-400 hover:text-red-300 transition"
                            title="Cerrar Sesión"
                        >
                            🚪
                        </button>
                        <button
                            onClick={onEditProfile}
                            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition"
                            title="Editar Perfil"
                        >
                            ⚙️
                        </button>
                        <button
                            onClick={() => setChatMode(chatMode === 'human' ? 'ai' : 'human')}
                            title="Alternar Modo IA"
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition relative ${
                                chatMode === 'ai'
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            🤖
                            {chatMode === 'ai' && <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>}
                        </button>
                    </div>
                </div>

                {/* BUSCADOR */}
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Buscar o iniciar chat"
                        className="w-full px-3 py-2 bg-slate-900 text-gray-400 text-sm rounded-md focus:outline-none"
                        disabled
                    />
                </div>

                {/* LISTA DE CONTACTOS */}
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => selectContact(contact)}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition ${
                                activeContactRef.current === contact.id ? 'bg-slate-700 border-l-4 border-blue-500' : ''
                            }`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                                    {contact.username?.charAt(0) || '?'}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{contact.username}</h4>
                                <p className="text-sm text-gray-400 truncate">Contacto disponible</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* VENTANA DE CHAT */}
            <div className="flex-1 flex flex-col bg-slate-900">
                {selectedContactId ? (
                    <>
                        {/* HEADER CHAT */}
                        <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                                        {selectedContactName?.charAt(0) || '?'}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{selectedContactName}</h2>
                                    <span className="text-xs text-green-400">Online</span>
                                </div>
                            </div>
                            <div className="flex gap-4 text-gray-400">
                                <button className="hover:text-white transition">📞</button>
                                <button className="hover:text-white transition">📹</button>
                            </div>
                        </div>

                        {/* MENSAJES */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    {chatMode === 'human' ? "Envía el primer mensaje..." : "La IA generando respuesta..."}
                                </div>
                            )}

                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                        msg.senderId === user.id
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-700 text-gray-200 rounded-tl-none'
                                    }`}>
                                        {/* Nombre del remitente (si no es el usuario actual) */}
                                        {msg.senderId !== user.id && msg.senderName && (
                                            <p className="text-xs text-gray-400 mb-1">{msg.senderName}</p>
                                        )}

                                        {msg.content && msg.content.startsWith('data:image') ? (
                                            <img src={msg.content} alt="Imagen" className="rounded max-w-full h-auto" />
                                        ) : (
                                            <p className="break-words">{msg.content}</p>
                                        )}

                                        <div className={`text-[10px] mt-1 text-right ${
                                            msg.senderId === user.id ? 'text-blue-200' : 'text-gray-500'
                                        }`}>
                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : ''}
                                            {msg.isTemp && <span className="ml-2 text-yellow-300">⏳</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* INPUT AREA */}
                        <div className="p-4 border-t border-slate-700 bg-slate-800 relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            {showEmojiPicker && (
                                <div className="absolute bottom-16 left-4 bg-slate-700 p-3 rounded-lg shadow-xl border border-slate-600 z-50">
                                    <div className="grid grid-cols-6 gap-2">
                                        {['😀','😂','😍','🥺','😎','🤔','👍','👎','❤️','🔥','🎉','🚀','👻','💩','👋','🙏','👀','💪','🧠','🔨'].map((emoji, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleEmojiClick(emoji)}
                                                className="text-2xl hover:scale-125 transition"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="p-2 text-gray-400 hover:text-white transition relative"
                                >
                                    ➕
                                </button>

                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={chatMode === 'ai' ? "Pregúntale algo a la IA..." : "Escribe un mensaje..."}
                                    className="flex-1 bg-slate-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-2 text-gray-400 hover:text-white transition relative"
                                >
                                    😊
                                </button>

                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 px-4 transition flex items-center justify-center">
                                    ➤
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Selecciona un contacto para chatear</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainChat;