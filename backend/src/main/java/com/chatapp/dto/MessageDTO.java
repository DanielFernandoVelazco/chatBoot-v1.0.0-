package com.chatapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
//import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private String id;
    private String chatId;
    private String senderId;
    private String senderName;
    private String content;
    private MessageType type;
    private LocalDateTime timestamp;
    private Boolean isRead;
    private Boolean isDelivered;

    public enum MessageType {
        TEXT, IMAGE, FILE, VIDEO, AUDIO
    }
}