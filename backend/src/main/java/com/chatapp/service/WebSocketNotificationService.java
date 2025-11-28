package com.chatapp.service;

import com.chatapp.dto.WebSocketMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyUserStatusChange(String userId, String status) {
        WebSocketMessage message = WebSocketMessage.builder()
                .senderId(userId)
                .action("USER_STATUS_CHANGE")
                .content(status)
                .build();

        // Notificar a todos los contactos del usuario
        messagingTemplate.convertAndSend("/topic/user/" + userId + "/status", message);
    }

    public void notifyNewChat(String chatId, String recipientId) {
        WebSocketMessage message = WebSocketMessage.builder()
                .chatId(chatId)
                .action("NEW_CHAT")
                .build();

        messagingTemplate.convertAndSendToUser(recipientId, "/queue/chats", message);
    }

    public void notifyMessageRead(String chatId, String messageId, String readerId) {
        WebSocketMessage message = WebSocketMessage.builder()
                .chatId(chatId)
                .id(messageId)
                .senderId(readerId)
                .action("MESSAGE_READ")
                .build();

        messagingTemplate.convertAndSend("/topic/chat/" + chatId + "/read", message);
    }
}