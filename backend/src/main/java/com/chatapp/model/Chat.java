package com.chatapp.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chats")
public class Chat {

    @Id
    private String id;

    private String name; // Para chats grupales
    private String description; // Para chats grupales
    private ChatType type; // PRIVATE, GROUP

    // Participantes del chat
    private List<String> participantIds;

    // Información del último mensaje (para mostrar en la lista de chats)
    private LastMessageInfo lastMessage;

    // Configuración específica del chat
    private ChatSettings settings;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Para chats privados, podemos almacenar información específica
    private String createdBy; // ID del usuario que creó el chat

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LastMessageInfo {
        private String messageId;
        private String content;
        private String senderId;
        private String senderName;
        private LocalDateTime timestamp;
        private MessageType messageType; // TEXT, IMAGE, FILE, etc.
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatSettings {
        private Boolean notificationsEnabled;
        private String customNotificationTone;
        private Boolean isArchived;
        private Boolean isPinned;
        private String theme; // Color o tema personalizado del chat
    }

    public enum ChatType {
        PRIVATE,
        GROUP
    }

    public enum MessageType {
        TEXT,
        IMAGE,
        FILE,
        VIDEO,
        AUDIO,
        SYSTEM
    }
}