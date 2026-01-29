import React, { useState } from 'react';

const MainChat = ({ user }) => {
    // Estado para controlar qué chat está activo
    const [selectedContact, setSelectedContact] = useState({
        name: "Elena Rodriguez",
        status: "Online",
        messages: [
            { id: 1, sender: "them", text: "Hey! Just wanted to follow up on our conversation from yesterday. Did you have a chance to look at the proposal?", time: "10:40 AM" },
            { id: 2, sender: "me", text: "Hi Elena! Yes, I did. It looks great. I just have a couple of minor suggestions I'll send over shortly.", time: "10:41 AM" },
            { id: 3, sender: "them", text: "Perfect! See you then.", time: "10:42 AM" }
        ]
    });

    // Lista de contactos mock (basada en la captura)
    const contacts = [
        { id: 1, name: "Elena Rodriguez", lastMsg: "Perfect! See you then.", time: "10:42 AM", active: true },
        { id: 2, name: "Marcus Chen", lastMsg: "Can you send over the file?", time: "Unread", active: false },
        { id: 3, name: "Aisha Khan", lastMsg: "Sounds good, I'll review it today.", time: "Yesterday", active: false },
        { id: 4, name: "John Doe", lastMsg: "Hey, are you free for a call?", time: "2 days ago", active: false },
    ];

    const [messageInput, setMessageInput] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: "me",
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Actualizar estado del chat (simulado)
        setSelectedContact({
            ...selectedContact,
            messages: [...selectedContact.messages, newMsg]
        });
        setMessageInput("");
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">

            {/* BARRA LATERAL IZQUIERDA (30% aprox) */}
            <div className="w-80 flex flex-col border-r border-slate-700 bg-slate-800">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                            {user ? user.username.substring(0, 2).toUpperCase() : 'ME'}
                        </div>
                        <span className="font-semibold">{user ? user.username : 'Mi Usuario'}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600">
                        ⚙️
                    </div>
                </div>

                <div className="p-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow text-sm font-medium">
                        + New Chat
                    </button>
                </div>

                {/* Lista de Contactos */}
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => {/* Función para cambiar de chat aquí */}}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition ${contact.active ? 'bg-slate-700 border-l-4 border-blue-500' : ''}`}
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                                    {contact.name.charAt(0)}
                                </div>
                                {contact.active ? <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span> : null}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-medium truncate">{contact.name}</h4>
                                    <span className="text-xs text-gray-400">{contact.time}</span>
                                </div>
                                <p className={`text-sm truncate ${contact.id === 2 ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                    {contact.lastMsg}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* VENTANA DE CHAT (RESTO) */}
            <div className="flex-1 flex flex-col bg-slate-900">

                {/* Header del Chat */}
                <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                                {selectedContact.name.charAt(0)}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{selectedContact.name}</h2>
                            <span className="text-xs text-green-400">{selectedContact.status}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 text-gray-400">
                        <button className="hover:text-white">📞</button>
                        <button className="hover:text-white">📹</button>
                        <button className="hover:text-white">ℹ️</button>
                    </div>
                </div>

                {/* Área de Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedContact.messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                msg.sender === 'me'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-slate-700 text-gray-200 rounded-tl-none'
                            }`}>
                                <p>{msg.text}</p>
                                <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700 bg-slate-800">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <button type="button" className="p-2 text-gray-400 hover:text-white">
                            ➕
                        </button>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="button" className="p-2 text-gray-400 hover:text-white">
                            😊
                        </button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 px-4 transition">
                            ➤
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default MainChat;