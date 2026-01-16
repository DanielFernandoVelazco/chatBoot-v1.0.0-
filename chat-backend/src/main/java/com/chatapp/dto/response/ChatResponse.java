package com.chatapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private Long id;
    private String name;
    private boolean isGroup;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;
    private List<UserResponse> participants;
    private List<MessageResponse> messages;
    private int unreadCount;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private String content;
    private String messageType;
    private boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}