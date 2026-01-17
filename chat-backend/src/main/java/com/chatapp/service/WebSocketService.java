package com.chatapp.service;

import com.chatapp.dto.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessageToUser(Long userId, MessageResponse message) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/messages",
                    message);
            log.debug("Message sent to user {} via WebSocket", userId);
        } catch (Exception e) {
            log.error("Failed to send WebSocket message to user {}: {}", userId, e.getMessage());
        }
    }

    public void sendTypingIndicator(Long senderId, Long receiverId, Long chatRoomId, boolean isTyping) {
        try {
            TypingNotification notification = new TypingNotification(
                    senderId, receiverId, chatRoomId, isTyping);

            if (chatRoomId != null) {
                // Group chat
                messagingTemplate.convertAndSend(
                        "/topic/chat/" + chatRoomId + "/typing",
                        notification);
            } else {
                // Private chat
                messagingTemplate.convertAndSendToUser(
                        receiverId.toString(),
                        "/queue/typing",
                        notification);
            }

        } catch (Exception e) {
            log.error("Failed to send typing indicator: {}", e.getMessage());
        }
    }

    public void notifyMessageRead(Long userId, Long chatRoomId) {
        try {
            ReadReceipt receipt = new ReadReceipt(userId, chatRoomId, System.currentTimeMillis());

            messagingTemplate.convertAndSend(
                    "/topic/chat/" + chatRoomId + "/read",
                    receipt);

        } catch (Exception e) {
            log.error("Failed to send read receipt: {}", e.getMessage());
        }
    }

    public void broadcastUserStatus(Long userId, boolean isOnline) {
        try {
            UserStatus status = new UserStatus(userId, isOnline);
            messagingTemplate.convertAndSend("/topic/presence", status);

        } catch (Exception e) {
            log.error("Failed to broadcast user status: {}", e.getMessage());
        }
    }

    // Inner DTO classes
    private static class TypingNotification {
        private final Long senderId;
        private final Long receiverId;
        private final Long chatRoomId;
        private final boolean typing;
        private final long timestamp;

        public TypingNotification(Long senderId, Long receiverId, Long chatRoomId, boolean typing) {
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.chatRoomId = chatRoomId;
            this.typing = typing;
            this.timestamp = System.currentTimeMillis();
        }

        // Getters
        public Long getSenderId() {
            return senderId;
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public Long getChatRoomId() {
            return chatRoomId;
        }

        public boolean isTyping() {
            return typing;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    private static class ReadReceipt {
        private final Long userId;
        private final Long chatRoomId;
        private final long readAt;

        public ReadReceipt(Long userId, Long chatRoomId, long readAt) {
            this.userId = userId;
            this.chatRoomId = chatRoomId;
            this.readAt = readAt;
        }

        // Getters
        public Long getUserId() {
            return userId;
        }

        public Long getChatRoomId() {
            return chatRoomId;
        }

        public long getReadAt() {
            return readAt;
        }
    }

    private static class UserStatus {
        private final Long userId;
        private final boolean online;
        private final long timestamp;

        public UserStatus(Long userId, boolean online) {
            this.userId = userId;
            this.online = online;
            this.timestamp = System.currentTimeMillis();
        }

        // Getters
        public Long getUserId() {
            return userId;
        }

        public boolean isOnline() {
            return online;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}