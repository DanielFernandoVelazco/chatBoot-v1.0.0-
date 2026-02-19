import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Peer from 'simple-peer';
import CallModal from '../components/CallModal';

const MainChat = ({ user, onLogout, onEditProfile, onAccountSettings, onHelp }) => {

    // --- ESTADOS ---
    const [contacts, setContacts] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedContactName, setSelectedContactName] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatMode, setChatMode] = useState('human');
    const [isConnected, setIsConnected] = useState(false);

    // Estados para llamadas
    const [callModalOpen, setCallModalOpen] = useState(false);
    const [callType, setCallType] = useState('audio');
    const [callStatus, setCallStatus] = useState('idle');
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [incomingCaller, setIncomingCaller] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    // --- REFs ---
    const fileInputRef = useRef(null);
    const activeContactRef = useRef(null);
    const stompClientRef = useRef(null);
    const stompConnectedRef = useRef(false);
    const isMountedRef = useRef(false);
    const processedMessageIds = useRef(new Set());
    const peerRef = useRef(null);

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
        processedMessageIds.current.clear();
    };

    const sendMessage = async (content) => {
        if (!content || !content.trim()) return;
        if (!activeContactRef.current) return;

        if (chatMode === 'ai') {
            // Modo IA
            try {
                const userTempMessage = {
                    id: `temp-${Date.now()}`,
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

                setMessages(prev => prev.filter(msg => msg.id !== userTempMessage.id).concat([aiMessage]));

            } catch (error) {
                console.error("Error en la IA:", error);
                alert("Error de IA");
                setMessages(prev => prev.filter(msg => !msg.id.toString().startsWith('temp-')));
            }
        } else {
            // Modo humano
            try {
                await axios.post(`${API_URL}/api/messages/send`, {
                    senderId: user.id,
                    receiverId: activeContactRef.current,
                    content: content
                });
                setMessageInput("");
            } catch (error) {
                console.error("Error enviando mensaje:", error);
                alert("Error al enviar mensaje");
            }
        }
    };

    // --- FUNCIONES DE LLAMADA ---

    const startCall = (type) => {
        if (!selectedContactId) {
            alert('Selecciona un contacto para llamar');
            return;
        }

        setCallType(type);
        setCallStatus('calling');
        setCallModalOpen(true);

        const constraints = {
            audio: true,
            video: type === 'video'
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                setLocalStream(stream);
                createPeer(stream, true);
            })
            .catch(err => {
                console.error('Error accessing media devices:', err);
                alert('No se pudieron acceder a los dispositivos de audio/video');
                setCallModalOpen(false);
                setCallStatus('idle');
            });
    };

    const createPeer = (stream, initiator) => {
        const peer = new Peer({
            initiator: initiator,
            trickle: false,
            stream: stream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        peer.on('signal', data => {
            if (stompClientRef.current && stompConnectedRef.current) {
                if (initiator) {
                    stompClientRef.current.send('/app/call.offer', {}, JSON.stringify({
                        callerId: user.id,
                        calleeId: selectedContactId,
                        offer: JSON.stringify(data),
                        callType: callType
                    }));
                } else if (incomingCaller) {
                    stompClientRef.current.send('/app/call.answer', {}, JSON.stringify({
                        callerId: incomingCaller.id,
                        calleeId: user.id,
                        answer: JSON.stringify(data)
                    }));
                }
            }
        });

        peer.on('stream', remoteStream => {
            setRemoteStream(remoteStream);
            setCallStatus('connected');
        });

        peer.on('close', () => {
            endCall();
        });

        peer.on('error', err => {
            console.error('Peer error:', err);
            endCall();
        });

        peerRef.current = peer;
    };

    const acceptCall = () => {
        setIsIncomingCall(false);
        setCallStatus('calling');

        const constraints = {
            audio: true,
            video: incomingCaller?.callType === 'video'
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                setLocalStream(stream);
                createPeer(stream, false);
            })
            .catch(err => {
                console.error('Error accessing media devices:', err);
                rejectCall();
            });
    };

    const rejectCall = () => {
        if (stompClientRef.current && stompConnectedRef.current && incomingCaller) {
            stompClientRef.current.send('/app/call.reject', {}, JSON.stringify({
                callerId: incomingCaller.id,
                calleeId: user.id
            }));
        }
        setIsIncomingCall(false);
        setIncomingCaller(null);
        setCallModalOpen(false);
        setCallStatus('idle');
    };

    const endCall = () => {
        if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
            setRemoteStream(null);
        }

        if (stompClientRef.current && stompConnectedRef.current) {
            stompClientRef.current.send('/app/call.end', {}, JSON.stringify({
                userId: user.id
            }));
        }

        setCallStatus('ended');
        setTimeout(() => {
            setCallModalOpen(false);
            setCallStatus('idle');
            setIsIncomingCall(false);
            setIncomingCaller(null);
        }, 2000);
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
                sendMessage(reader.result);
            };
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        sendMessage(messageInput);
    };

    // --- EFECTOS ---

    // Sincronizar Ref con Estado
    useEffect(() => {
        activeContactRef.current = selectedContactId;
    }, [selectedContactId]);

    // Cargar Contactos
    useEffect(() => {
        const fetchContacts = async () => {
            if (!user || !user.id) return;
            try {
                const response = await axios.get(`${API_URL}/api/auth/users`);
                const allUsers = response.data;
                const otherUsers = allUsers.filter(u => u.id !== user.id);
                setContacts(otherUsers);
                if (otherUsers.length > 0 && !selectedContactId) {
                    selectContact(otherUsers[0]);
                }
            } catch (error) {
                console.error("Error cargando contactos", error);
            }
        };
        fetchContacts();
    }, [user.id]);

    // CONEXIÓN WEBSOCKET
    useEffect(() => {
        if (!user || !user.id) return;
        if (stompClientRef.current && stompConnectedRef.current) return;

        const socket = new SockJS('http://localhost:8081/ws-chat');
        const client = Stomp.over(socket);
        client.debug = () => {};

        isMountedRef.current = true;

        client.connect({}, () => {
            stompClientRef.current = client;
            stompConnectedRef.current = true;
            setIsConnected(true);

            // Suscripción a mensajes
            client.subscribe('/topic/messages', (message) => {
                if (!isMountedRef.current) return;
                const newMessage = JSON.parse(message.body);
                const activeId = activeContactRef.current;

                const messageKey = `${newMessage.id}`;
                if (processedMessageIds.current.has(messageKey)) return;
                processedMessageIds.current.add(messageKey);

                const isForMe =
                    (newMessage.receiverId === user.id && activeId === newMessage.senderId) ||
                    (newMessage.senderId === user.id && activeId === newMessage.receiverId);

                if (isForMe) {
                    setMessages(prev => {
                        if (prev.some(msg => msg.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                }
            });

            // Suscripción a eventos de llamada
            client.subscribe(`/user/${user.id}/queue/calls`, (message) => {
                const callEvent = JSON.parse(message.body);
                console.log('📞 Evento de llamada:', callEvent);

                switch(callEvent.type) {
                    case 'offer':
                        const caller = contacts.find(c => c.id === callEvent.callerId);
                        setIncomingCaller({
                            id: callEvent.callerId,
                            username: caller?.username || 'Desconocido',
                            callType: callEvent.callType
                        });
                        setCallType(callEvent.callType);
                        setIsIncomingCall(true);
                        setCallModalOpen(true);
                        setCallStatus('ringing');

                        if (peerRef.current) {
                            peerRef.current.signal(JSON.parse(callEvent.offer));
                        }
                        break;

                    case 'answer':
                        if (peerRef.current) {
                            peerRef.current.signal(JSON.parse(callEvent.answer));
                        }
                        break;

                    case 'call-rejected':
                        alert('❌ Llamada rechazada');
                        endCall();
                        break;

                    case 'call-ended':
                        alert('📞 El otro usuario finalizó la llamada');
                        endCall();
                        break;

                    default:
                        break;
                }
            });

        }, (error) => {
            console.error("❌ Error conectando WebSocket", error);
            stompConnectedRef.current = false;
            setIsConnected(false);
        });

        return () => {
            isMountedRef.current = false;
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [user.id, contacts]);

    // --- RENDERIZADO ---
    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* BARRA LATERAL */}
            <div className="w-80 flex flex-col border-r border-slate-700 bg-slate-800">
                {/* HEADER */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                            {user.username?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <span className="font-semibold truncate">{user.username}</span>
                    </div>

                    <div className="flex gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mt-3`} title={isConnected ? 'Conectado' : 'Desconectado'}></div>
                        <button onClick={onHelp} className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600" title="Ayuda">❓</button>
                        <button onClick={onLogout} className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 text-red-400" title="Cerrar Sesión">🚪</button>
                        <button onClick={onEditProfile} className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600" title="Editar Perfil">⚙️</button>
                        <button onClick={() => setChatMode(chatMode === 'human' ? 'ai' : 'human')} className={`w-8 h-8 rounded-full flex items-center justify-center ${chatMode === 'ai' ? 'bg-purple-600' : 'bg-slate-700'}`} title="Alternar Modo IA">🤖</button>
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
                    {contacts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No hay contactos disponibles
                        </div>
                    ) : (
                        contacts.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => selectContact(contact)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition ${
                                    selectedContactId === contact.id ? 'bg-slate-700 border-l-4 border-blue-500' : ''
                                }`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                                        {contact.username?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{contact.username}</h4>
                                    <p className="text-sm text-gray-400 truncate">
                                        {contact.lastSeenText || 'Contacto disponible'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* VENTANA DE CHAT */}
            <div className="flex-1 flex flex-col bg-slate-900">
                {selectedContactId ? (
                    <>
                        {/* HEADER CHAT - CON BOTONES DE LLAMADA */}
                        <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                                        {selectedContactName?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{selectedContactName}</h2>
                                    <span className="text-xs text-green-400">Online</span>
                                </div>
                            </div>
                            <div className="flex gap-4 text-gray-400">
                                {/* BOTÓN DE LLAMADA DE VOZ */}
                                <button
                                    onClick={() => startCall('audio')}
                                    className="hover:text-white transition text-2xl hover:scale-110"
                                    title="Llamada de voz"
                                >
                                    📞
                                </button>
                                {/* BOTÓN DE VIDELLAMADA */}
                                <button
                                    onClick={() => startCall('video')}
                                    className="hover:text-white transition text-2xl hover:scale-110"
                                    title="Videollamada"
                                >
                                    📹
                                </button>
                            </div>
                        </div>

                        {/* MENSAJES */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    {chatMode === 'human' ? "Envía el primer mensaje..." : "Pregúntale algo a la IA..."}
                                </div>
                            )}

                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                        msg.senderId === user.id
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-700 text-gray-200 rounded-tl-none'
                                    }`}>
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

            {/* MODAL DE LLAMADA */}
            <CallModal
                isOpen={callModalOpen}
                onClose={endCall}
                callType={callType}
                contactName={isIncomingCall ? incomingCaller?.username : selectedContactName}
                contactAvatar={isIncomingCall ? incomingCaller?.username?.charAt(0) : selectedContactName?.charAt(0)}
                isIncoming={isIncomingCall}
                onAccept={acceptCall}
                onReject={rejectCall}
                localStream={localStream}
                remoteStream={remoteStream}
                callStatus={callStatus}
            />
        </div>
    );
};

export default MainChat;