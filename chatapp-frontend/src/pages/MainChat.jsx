import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const MainChat = ({ user, onLogout, onEditProfile, onAccountSettings, onHelp }) => {

    const [contacts, setContacts] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedContactName, setSelectedContactName] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const stompClientRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const [activeContactId, setActiveContactId] = useState(null);
    const activeContactRef = useRef(null);
    const isMountedRef = useRef(false); // AGREGAR ESTO

    const API_URL = 'http://localhost:8081';

    // Sincronizar el Ref con el Estado
    useEffect(() => {
        activeContactRef.current = activeContactId;
    }, [activeContactId]);

    // 1. Cargar Contactos al montar el componente (Solo aparece una vez)
    useEffect(() => {
        const fetchContacts = async () => {
            if (!user || !user.id) return;

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

    // 2. CONEXIÓN WEBSOCKET BLINDADA
    useEffect(() => {
        if (!user || !user.id) return;

        const socket = new SockJS('http://localhost:8081/ws-chat', null, { withCredentials: false });
        const client = Stomp.over(socket);
        client.debug = () => {};

        let subscription = null;

        isMountedRef.current = true; // Marcamos como "vivo"

        client.connect({}, () => {
            console.log('Conectado al WebSocket');
            stompClientRef.current = client;

            // 3. Suscribirse
            subscription = client.subscribe('/topic/messages', (message) => {

                // -----------------------------
                // DEFENSA PRINCIPAL: ¿Sigo vivo?
                // Si el componente se desmontó mientras el mensaje llegaba,
                // cancelamos aquí.
                // -----------------------------
                if (!isMountedRef.current) {
                    console.warn("Componente desmontado. Ignorando mensaje.");
                    return;
                }

                const newMessage = JSON.parse(message.body);
                const activeId = activeContactRef.current;

                // LOGS DE DEPURACIÓN
                console.log("--- VERIFICANDO MENSAJE ---");
                console.log("Mensaje:", newMessage);
                console.log("Mi ID:", user.id);
                console.log("Chat Activo:", activeId);

                const isForMe =
                    (newMessage.receiverId === user.id && activeId === newMessage.senderId) ||
                    (newMessage.senderId === user.id && activeId === newMessage.receiverId);

                if (isForMe) {
                    console.log(">>> RESULTADO: MOSTRAR MENSAJE");
                    setMessages(prev => {
                        if (prev.some(msg => msg.id === newMessage.id)) {
                            return prev; // Evitar duplicados estrictos
                        }
                        return [...prev, newMessage];
                    });
                } else {
                    console.log(">>> RESULTADO: IGNORAR (Es de otro chat)");
                }
            });

        }, (error) => {
            console.error("Error conectando WebSocket", error);
        });

        // LIMPIEZA FORZADA
        return () => {
            console.log("Desmontando WebSocket...");
            isMountedRef.current = false; // Marcamos como "muerto" inmediatamente

            // 1. Cancelar suscripción
            if (subscription) {
                subscription.unsubscribe();
            }
            // 2. Desconectar socket (Si existe)
            // Nota: sockjs client es una referencia, no el objeto conectado siempre
            if (client) {
                try {
                    client.disconnect();
                } catch(e) {}
            }
        };
    }, [user.id]);  // 2. CONEXIÓN WEBSOCKET BLINDADA
    useEffect(() => {
        if (!user || !user.id) return;

        const socket = new SockJS('http://localhost:8081/ws-chat', null, { withCredentials: false });
        const client = Stomp.over(socket);
        client.debug = () => {};

        let subscription = null;

        isMountedRef.current = true; // Marcamos como "vivo"

        client.connect({}, () => {
            console.log('Conectado al WebSocket');
            stompClientRef.current = client;

            // 3. Suscribirse
            subscription = client.subscribe('/topic/messages', (message) => {

                // -----------------------------
                // DEFENSA PRINCIPAL: ¿Sigo vivo?
                // Si el componente se desmontó mientras el mensaje llegaba,
                // cancelamos aquí.
                // -----------------------------
                if (!isMountedRef.current) {
                    console.warn("Componente desmontado. Ignorando mensaje.");
                    return;
                }

                const newMessage = JSON.parse(message.body);
                const activeId = activeContactRef.current;

                // LOGS DE DEPURACIÓN
                console.log("--- VERIFICANDO MENSAJE ---");
                console.log("Mensaje:", newMessage);
                console.log("Mi ID:", user.id);
                console.log("Chat Activo:", activeId);

                const isForMe =
                    (newMessage.receiverId === user.id && activeId === newMessage.senderId) ||
                    (newMessage.senderId === user.id && activeId === newMessage.receiverId);

                if (isForMe) {
                    console.log(">>> RESULTADO: MOSTRAR MENSAJE");
                    setMessages(prev => {
                        if (prev.some(msg => msg.id === newMessage.id)) {
                            return prev; // Evitar duplicados estrictos
                        }
                        return [...prev, newMessage];
                    });
                } else {
                    console.log(">>> RESULTADO: IGNORAR (Es de otro chat)");
                }
            });

        }, (error) => {
            console.error("Error conectando WebSocket", error);
        });

        // LIMPIEZA FORZADA
        return () => {
            console.log("Desmontando WebSocket...");
            isMountedRef.current = false; // Marcamos como "muerto" inmediatamente

            // 1. Cancelar suscripción
            if (subscription) {
                subscription.unsubscribe();
            }
            // 2. Desconectar socket (Si existe)
            // Nota: sockjs client es una referencia, no el objeto conectado siempre
            if (client) {
                try {
                    client.disconnect();
                } catch(e) {}
            }
        };
    }, [user.id]);

    // 2. Función para seleccionar un contacto y cargar su chat
    const selectContact = (contact) => {
        const contactId = contact.id;

        // ---------------------------------------------------
        // SOLUCIÓN CRÍTICA: Forzar actualización del Ref aquí.
        // Aseguramos que el WebSocket sepa el contacto activo INMEDIATAMENTE
        // ---------------------------------------------------
        activeContactRef.current = contactId;
        setActiveContactId(contactId);
        setSelectedContactName(contact.username);
        loadMessages(user.id, contactId);
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

    // 4. Enviar Mensaje (Manejado desde el form)
    const handleSendMessage = async (e) => {
        e.preventDefault();
        sendMessageImage(messageInput); // Reutilizamos la función lógica
    };

    // FUNCIÓN LÓGICA DE ENVÍO (Texto o Imagen)
    const sendMessageImage = async (content) => {
        if (!content.trim() && typeof content !== 'string') return;
        if (!activeContactRef.current) return; // Usamos Ref para verificación inmediata

        const tempId = Date.now();

        const newMessage = {
            id: tempId,
            senderId: user.id,
            content: content,
            timestamp: new Date().toISOString()
        };

        // Optimista: Mostramos el mensaje inmediatamente
        setMessages(prev => [...prev, newMessage]);
        setMessageInput("");

        try {
            await axios.post(`${API_URL}/api/messages/send`, {
                senderId: user.id,
                receiverId: activeContactRef.current,
                content: content
            });
            console.log("Mensaje enviado");
        } catch (error) {
            console.error("Error enviando mensaje", error);
        }
    };

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

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">

            {/* BARRA LATERAL IZQUIERDA */}
            <div className="w-80 flex flex-col border-r border-slate-700 bg-slate-800">

                {/* HEADER DE LA BARRA LATERAL */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold truncate">{user.username}</span>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex gap-2">
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
                    </div>
                </div>

                {/* Búsqueda (Decorativa) */}
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Buscar o iniciar chat"
                        className="w-full px-3 py-2 bg-slate-900 text-gray-400 text-sm rounded-md focus:outline-none"
                        disabled
                    />
                </div>

                {/* Lista de Contactos (Real) */}
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => selectContact(contact)}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition ${
                                activeContactId === contact.id ? 'bg-slate-700 border-l-4 border-blue-500' : ''
                            }`}
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                                    {contact.username.charAt(0)}
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

            {/* VENTANA DE CHAT (RESTO) */}
            <div className="flex-1 flex flex-col bg-slate-900">
                {activeContactId ? (
                    <>
                        {/* Header del Chat */}
                        <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                                        {selectedContactName.charAt(0)}
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

                        {/* Área de Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">Envía el primer mensaje...</div>
                            )}

                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                        msg.senderId === user.id
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-700 text-gray-200 rounded-tl-none'
                                    }`}>

                                        {/* DETECTAR SI ES IMAGEN O TEXTO */}
                                        {msg.content.startsWith('data:image') ? (
                                            <img src={msg.content} alt="Imagen" className="rounded max-w-full h-auto" />
                                        ) : (
                                            <p>{msg.content}</p>
                                        )}

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
                        <div className="p-4 border-t border-slate-700 bg-slate-800 relative">

                            {/* INPUT DE ARCHIVO OCULTO */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            {/* PICKER DE EMOJIS */}
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

                                {/* BOTÓN + (Cargar Imagen) */}
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
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {/* BOTÓN CARA FELIZ (Emojis) */}
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-2 text-gray-400 hover:text-white transition relative"
                                >
                                    😊
                                    {showEmojiPicker && <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>}
                                </button>

                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 px-4 transition flex items-center justify-center">
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