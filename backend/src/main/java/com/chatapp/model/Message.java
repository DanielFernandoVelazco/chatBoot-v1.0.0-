package com.chatapp.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @Indexed
    private String chatId; // Referencia al chat

    private String senderId; // ID del usuario que envió el mensaje
    private String senderName; // Nombre del sender (caché para performance)

    private MessageType type;
    private String content;

    // Para mensajes que son respuestas a otros mensajes
    private ReplyInfo replyTo;

    // Para mensajes editados
    private EditInfo editInfo;

    // Metadatos de archivos/imágenes
    private FileMetadata fileMetadata;

    // Información de entrega y lectura
    private DeliveryStatus deliveryStatus;

    // Reacciones al mensaje
    private List<Reaction> reactions;

    @Indexed
    private LocalDateTime timestamp;
    private LocalDateTime deliveredAt;
    private LocalDateTime readAt;

    // Metadata adicional
    private Map<String, Object> metadata;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReplyInfo {
        private String messageId;
        private String senderName;
        private String previewContent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EditInfo {
        private String previousContent;
        private LocalDateTime editedAt;
        private Integer editCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FileMetadata {
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize; // en bytes
        private String thumbnailUrl; // para imágenes/videos
        private Integer duration; // para audio/video en segundos
        private Integer width; // para imágenes/videos
        private Integer height; // para imágenes/videos
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DeliveryStatus {
        private Boolean delivered;
        private Boolean read;
        private List<String> readBy; // IDs de usuarios que han leído el mensaje
        private List<String> deliveredTo; // IDs de usuarios que han recibido el mensaje
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Reaction {
        private String userId;
        private String emoji;
        private LocalDateTime timestamp;
    }

    public enum MessageType {
        TEXT,
        IMAGE,
        FILE,
        VIDEO,
        AUDIO,
        LOCATION,
        CONTACT,
        SYSTEM // Para mensajes del sistema (usuario X se unió, etc.)
    }
}