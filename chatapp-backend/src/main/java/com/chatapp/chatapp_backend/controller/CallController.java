package com.chatapp.chatapp_backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class CallController {

    private final SimpMessagingTemplate messagingTemplate;

    // Mapa para mantener registro de usuarios en llamada
    private final Map<Long, Long> activeCalls = new ConcurrentHashMap<>();

    public CallController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/call.offer")
    public void handleCallOffer(@Payload Map<String, Object> payload) {
        Long callerId = Long.valueOf(payload.get("callerId").toString());
        Long calleeId = Long.valueOf(payload.get("calleeId").toString());
        String offer = payload.get("offer").toString();
        String callType = payload.get("callType").toString(); // "audio" o "video"

        Map<String, Object> message = Map.of(
                "type", "offer",
                "callerId", callerId,
                "offer", offer,
                "callType", callType
        );

        // Enviar oferta al destinatario
        messagingTemplate.convertAndSendToUser(
                calleeId.toString(),
                "/queue/calls",
                message
        );
    }

    @MessageMapping("/call.answer")
    public void handleCallAnswer(@Payload Map<String, Object> payload) {
        Long callerId = Long.valueOf(payload.get("callerId").toString());
        Long calleeId = Long.valueOf(payload.get("calleeId").toString());
        String answer = payload.get("answer").toString();

        // Registrar llamada activa
        activeCalls.put(callerId, calleeId);
        activeCalls.put(calleeId, callerId);

        Map<String, Object> message = Map.of(
                "type", "answer",
                "calleeId", calleeId,
                "answer", answer
        );

        // Enviar respuesta al caller
        messagingTemplate.convertAndSendToUser(
                callerId.toString(),
                "/queue/calls",
                message
        );
    }

    @MessageMapping("/call.ice-candidate")
    public void handleIceCandidate(@Payload Map<String, Object> payload) {
        Long targetId = Long.valueOf(payload.get("targetId").toString());
        String candidate = payload.get("candidate").toString();

        Map<String, Object> message = Map.of(
                "type", "ice-candidate",
                "candidate", candidate
        );

        messagingTemplate.convertAndSendToUser(
                targetId.toString(),
                "/queue/calls",
                message
        );
    }

    @MessageMapping("/call.end")
    public void handleCallEnd(@Payload Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long otherId = activeCalls.remove(userId);

        if (otherId != null) {
            activeCalls.remove(otherId);

            Map<String, Object> message = Map.of(
                    "type", "call-ended",
                    "userId", userId
            );

            messagingTemplate.convertAndSendToUser(
                    otherId.toString(),
                    "/queue/calls",
                    message
            );
        }
    }

    @MessageMapping("/call.reject")
    public void handleCallReject(@Payload Map<String, Object> payload) {
        Long callerId = Long.valueOf(payload.get("callerId").toString());
        Long calleeId = Long.valueOf(payload.get("calleeId").toString());

        Map<String, Object> message = Map.of(
                "type", "call-rejected",
                "calleeId", calleeId
        );

        messagingTemplate.convertAndSendToUser(
                callerId.toString(),
                "/queue/calls",
                message
        );
    }
}