package com.chatapp.dto;

import com.chatapp.model.Message;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebSocketMessage {
    private String id;
    private String chatId;
    private String senderId;
    private String senderName;
    private String content;
    private Message.MessageType type;
    private LocalDateTime timestamp;
    private String action; // SEND, EDIT, DELETE, REACTION

    // Para ediciones
    private String previousContent;

    // Para reacciones
    private String emoji;
    private String reactionUserId;
}
