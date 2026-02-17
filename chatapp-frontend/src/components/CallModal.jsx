import React, { useEffect, useRef, useState } from 'react';

const CallModal = ({
                       isOpen,
                       onClose,
                       callType, // 'audio' o 'video'
                       contactName,
                       contactAvatar,
                       isIncoming, // true si es llamada entrante
                       onAccept,
                       onReject,
                       localStream,
                       remoteStream,
                       callStatus // 'calling', 'ringing', 'connected', 'ended'
                   }) => {

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef(null);

    // Efecto para el video local
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Efecto para el video remoto
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Efecto para el temporizador de duración de llamada
    useEffect(() => {
        if (callStatus === 'connected') {
            // Iniciar contador de duración
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                setCallDuration(0);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [callStatus]);

    // Formatear duración de llamada (MM:SS)
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Silenciar/activar micrófono
    const toggleMute = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    // Activar/desactivar video
    const toggleVideo = () => {
        if (localStream && callType === 'video') {
            const videoTracks = localStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    // Si el modal no está abierto, no renderizar nada
    if (!isOpen) return null;

    // Determinar el nombre a mostrar (con validación)
    const displayName = contactName || 'Contacto';
    const displayAvatar = contactAvatar || (displayName ? displayName.charAt(0).toUpperCase() : '?');

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-slate-900 rounded-2xl w-full max-w-4xl overflow-hidden border border-slate-700 shadow-2xl">

                {/* Header */}
                <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                            {displayAvatar}
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{displayName}</h3>
                            <p className="text-xs text-gray-400">
                                {callStatus === 'calling' && '📞 Llamando...'}
                                {callStatus === 'ringing' && (isIncoming ? '🔔 Llamada entrante...' : '🔔 Timbre...')}
                                {callStatus === 'connected' && `⏱️ ${formatDuration(callDuration)}`}
                                {callStatus === 'ended' && '❌ Llamada finalizada'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                {/* Contenido principal */}
                <div className="relative bg-black min-h-[400px] flex items-center justify-center">

                    {/* Video remoto (principal) */}
                    {callType === 'video' && remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full bg-indigo-600 mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white">
                                {displayAvatar}
                            </div>
                            <p className="text-white text-xl">{displayName}</p>
                            <p className="text-gray-400 mt-2">
                                {callType === 'audio' ? '🎤 Llamada de voz' : '📹 Videollamada'}
                            </p>
                            {callStatus === 'connected' && callType === 'audio' && (
                                <p className="text-green-400 text-sm mt-4">
                                    Hablando...
                                </p>
                            )}
                        </div>
                    )}

                    {/* Video local (esquina) - solo visible en videollamada y cuando hay stream */}
                    {callType === 'video' && localStream && (
                        <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-600 shadow-lg">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {isVideoOff && (
                                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                                    <span className="text-gray-400">Cámara apagada</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Overlay para llamada entrante */}
                    {isIncoming && callStatus === 'ringing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-green-500 mx-auto mb-4 animate-pulse flex items-center justify-center text-4xl">
                                    📞
                                </div>
                                <p className="text-white text-xl mb-6">Llamada entrante...</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={onAccept}
                                        className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-bold flex items-center gap-2 transition"
                                    >
                                        ✅ Aceptar
                                    </button>
                                    <button
                                        onClick={onReject}
                                        className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white font-bold flex items-center gap-2 transition"
                                    >
                                        ❌ Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Indicador de micrófono silenciado */}
                    {isMuted && callStatus === 'connected' && (
                        <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            <span>🔇</span>
                            Micrófono silenciado
                        </div>
                    )}
                </div>

                {/* Controles de llamada (solo cuando está conectado) */}
                {callStatus === 'connected' && (
                    <div className="bg-slate-800 p-6 flex justify-center gap-6">
                        <button
                            onClick={toggleMute}
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition ${
                                isMuted
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                            title={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
                        >
                            {isMuted ? '🔇' : '🎤'}
                        </button>

                        {callType === 'video' && (
                            <button
                                onClick={toggleVideo}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition ${
                                    isVideoOff
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-slate-700 hover:bg-slate-600'
                                }`}
                                title={isVideoOff ? 'Activar cámara' : 'Apagar cámara'}
                            >
                                {isVideoOff ? '📷❌' : '📷'}
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-2xl transition"
                            title="Colgar"
                        >
                            📞
                        </button>
                    </div>
                )}

                {/* Botón para colgar (cuando no está conectado) */}
                {callStatus !== 'connected' && callStatus !== 'ended' && (
                    <div className="bg-slate-800 p-4 flex justify-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white font-bold flex items-center gap-2 transition"
                        >
                            📞 Cancelar
                        </button>
                    </div>
                )}

                {/* Mensaje de llamada finalizada */}
                {callStatus === 'ended' && (
                    <div className="bg-slate-800 p-4 text-center">
                        <p className="text-gray-400 mb-4">Llamada finalizada</p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallModal;