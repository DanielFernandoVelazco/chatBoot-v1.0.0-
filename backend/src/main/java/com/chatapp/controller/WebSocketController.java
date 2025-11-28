package com.chatapp.controller;

import com.chatapp.dto.WebSocketMessage;
import com.chatapp.model.Message;
import com.chatapp.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/chat/{chatId}/send")
    public void sendMessage(@DestinationVariable String chatId, @Payload WebSocketMessage webSocketMessage) {
        try {
            // Guardar el mensaje en la base de datos
            Message savedMessage = messageService.sendMessage(
                    chatId,
                    webSocketMessage.getContent(),
                    webSocketMessage.getType());

            // Convertir a DTO para WebSocket
            WebSocketMessage response = WebSocketMessage.builder()
                    .id(savedMessage.getId())
                    .chatId(savedMessage.getChatId())
                    .senderId(savedMessage.getSenderId())
                    .senderName(savedMessage.getSenderName())
                    .content(savedMessage.getContent())
                    .type(savedMessage.getType())
                    .timestamp(savedMessage.getTimestamp())
                    .action("SEND")
                    .build();

            // Enviar a todos los suscriptores del chat
            messagingTemplate.convertAndSend("/topic/chat/" + chatId, response);

            // Enviar notificación a los participantes (excepto al remitente)
            messagingTemplate.convertAndSendToUser(
                    savedMessage.getSenderId(),
                    "/queue/notifications",
                    WebSocketMessage.builder()
                            .action("MESSAGE_SENT")
                            .chatId(chatId)
                            .content("Mensaje enviado")
                            .build());

        } catch (Exception e) {
            log.error("Error enviando mensaje via WebSocket: {}", e.getMessage());

            // Enviar error al remitente
            messagingTemplate.convertAndSendToUser(
                    webSocketMessage.getSenderId(),
                    "/queue/errors",
                    WebSocketMessage.builder()
                            .action("ERROR")
                            .content("Error enviando mensaje: " + e.getMessage())
                            .build());
        }
    }

    @MessageMapping("/chat/{chatId}/edit")
    public void editMessage(@DestinationVariable String chatId, @Payload WebSocketMessage webSocketMessage) {
        try {
            Message editedMessage = messageService.editMessage(
                    webSocketMessage.getId(),
                    webSocketMessage.getContent());

            WebSocketMessage response = WebSocketMessage.builder()
                    .id(editedMessage.getId())
                    .chatId(editedMessage.getChatId())
                    .content(editedMessage.getContent())
                    .previousContent(webSocketMessage.getPreviousContent())
                    .timestamp(editedMessage.getTimestamp())
                    .action("EDIT")
                    .build();

            messagingTemplate.convertAndSend("/topic/chat/" + chatId, response);

        } catch (Exception e) {
            log.error("Error editando mensaje via WebSocket: {}", e.getMessage());
        }
    }

    @MessageMapping("/chat/{chatId}/delete")
    public void deleteMessage(@DestinationVariable String chatId, @Payload WebSocketMessage webSocketMessage) {
        try {
            messageService.deleteMessage(webSocketMessage.getId());

            WebSocketMessage response = WebSocketMessage.builder()
                    .id(webSocketMessage.getId())
                    .chatId(chatId)
                    .action("DELETE")
                    .build();

            messagingTemplate.convertAndSend("/topic/chat/" + chatId, response);

        } catch (Exception e) {
            log.error("Error eliminando mensaje via WebSocket: {}", e.getMessage());
        }
    }

    @MessageMapping("/chat/{chatId}/reaction")
    public void addReaction(@DestinationVariable String chatId, @Payload WebSocketMessage webSocketMessage) {
        try {
            Message message = messageService.addReaction(
                    webSocketMessage.getId(),
                    webSocketMessage.getEmoji());

            WebSocketMessage response = WebSocketMessage.builder()
                    .id(message.getId())
                    .chatId(chatId)
                    .emoji(webSocketMessage.getEmoji())
                    .reactionUserId(webSocketMessage.getSenderId())
                    .action("REACTION")
                    .build();

            messagingTemplate.convertAndSend("/topic/chat/" + chatId, response);

        } catch (Exception e) {
            log.error("Error agregando reacción via WebSocket: {}", e.getMessage());
        }
    }

    @MessageMapping("/user/typing")
    public void handleTyping(@Payload WebSocketMessage webSocketMessage) {
        WebSocketMessage typingMessage = WebSocketMessage.builder()
                .senderId(webSocketMessage.getSenderId())
                .senderName(webSocketMessage.getSenderName())
                .chatId(webSocketMessage.getChatId())
                .action("TYPING")
                .build();

        // Enviar a todos los participantes del chat excepto al que está escribiendo
        messagingTemplate.convertAndSend(
                "/topic/chat/" + webSocketMessage.getChatId() + "/typing",
                typingMessage);
    }

    @MessageMapping("/user/stop-typing")
    public void handleStopTyping(@Payload WebSocketMessage webSocketMessage) {
        WebSocketMessage stopTypingMessage = WebSocketMessage.builder()
                .senderId(webSocketMessage.getSenderId())
                .senderName(webSocketMessage.getSenderName())
                .chatId(webSocketMessage.getChatId())
                .action("STOP_TYPING")
                .build();

        messagingTemplate.convertAndSend(
                "/topic/chat/" + webSocketMessage.getChatId() + "/typing",
                stopTypingMessage);
    }
}