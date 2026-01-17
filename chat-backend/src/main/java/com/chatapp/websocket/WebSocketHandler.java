package com.chatapp.websocket;

import com.chatapp.dto.request.MessageRequest;
import com.chatapp.dto.response.MessageResponse;
import com.chatapp.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload WebSocketMessage message,
            SimpMessageHeaderAccessor headerAccessor) {

        log.info("Received message: {}", message);

        try {
            Long senderId = Long.parseLong(headerAccessor.getUser().getName());

            // Convert WebSocketMessage to MessageRequest
            MessageRequest request = MessageRequest.builder()
                    .receiverId(message.getReceiverId())
                    .chatRoomId(message.getChatRoomId())
                    .content(message.getContent())
                    .messageType(message.getMessageType())
                    .build();

            // Save message via service
            MessageResponse savedMessage = chatService.sendMessage(request, senderId);

            // Send to receiver
            messagingTemplate.convertAndSendToUser(
                    message.getReceiverId().toString(),
                    "/queue/messages",
                    savedMessage);

            // Also send to sender (for sync)
            messagingTemplate.convertAndSendToUser(
                    senderId.toString(),
                    "/queue/messages",
                    savedMessage);

            // Broadcast to chat room
            if (message.getChatRoomId() != null) {
                messagingTemplate.convertAndSend(
                        "/topic/chat/" + message.getChatRoomId(),
                        savedMessage);
            }

        } catch (Exception e) {
            log.error("Error sending message via WebSocket: {}", e.getMessage());
            // Send error back to sender
            messagingTemplate.convertAndSendToUser(
                    headerAccessor.getUser().getName(),
                    "/queue/errors",
                    new ErrorMessage("Failed to send message: " + e.getMessage()));
        }
    }

    @MessageMapping("/chat.typing")
    public void typingIndicator(@Payload TypingMessage typingMessage,
            SimpMessageHeaderAccessor headerAccessor) {

        try {
            Long senderId = Long.parseLong(headerAccessor.getUser().getName());

            TypingNotification notification = new TypingNotification(
                    senderId,
                    typingMessage.getReceiverId(),
                    typingMessage.getChatRoomId(),
                    typingMessage.isTyping());

            // Send typing indicator to receiver
            messagingTemplate.convertAndSendToUser(
                    typingMessage.getReceiverId().toString(),
                    "/queue/typing",
                    notification);

            // If group chat, send to all participants
            if (typingMessage.getChatRoomId() != null) {
                notification.setSenderId(senderId);
                messagingTemplate.convertAndSend(
                        "/topic/chat/" + typingMessage.getChatRoomId() + "/typing",
                        notification);
            }

        } catch (Exception e) {
            log.error("Error sending typing indicator: {}", e.getMessage());
        }
    }

    @MessageMapping("/chat.read")
    public void markAsRead(@Payload ReadMessage readMessage,
            SimpMessageHeaderAccessor headerAccessor) {

        try {
            Long userId = Long.parseLong(headerAccessor.getUser().getName());

            // Mark messages as read via service
            chatService.markMessagesAsRead(readMessage.getChatRoomId(), userId);

            // Notify sender that messages were read
            ReadReceipt receipt = new ReadReceipt(
                    userId,
                    readMessage.getChatRoomId(),
                    System.currentTimeMillis());

            messagingTemplate.convertAndSend(
                    "/topic/chat/" + readMessage.getChatRoomId() + "/read",
                    receipt);

        } catch (Exception e) {
            log.error("Error marking messages as read: {}", e.getMessage());
        }
    }

    // Inner DTO classes for WebSocket messages
    private static class WebSocketMessage {
        private Long receiverId;
        private Long chatRoomId;
        private String content;
        private String messageType = "TEXT";

        // Getters and setters
        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }

        public Long getChatRoomId() {
            return chatRoomId;
        }

        public void setChatRoomId(Long chatRoomId) {
            this.chatRoomId = chatRoomId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getMessageType() {
            return messageType;
        }

        public void setMessageType(String messageType) {
            this.messageType = messageType;
        }
    }

    private static class TypingMessage {
        private Long receiverId;
        private Long chatRoomId;
        private boolean typing;

        // Getters and setters
        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }

        public Long getChatRoomId() {
            return chatRoomId;
        }

        public void setChatRoomId(Long chatRoomId) {
            this.chatRoomId = chatRoomId;
        }

        public boolean isTyping() {
            return typing;
        }

        public void setTyping(boolean typing) {
            this.typing = typing;
        }
    }

    private static class ReadMessage {
        private Long chatRoomId;

        // Getters and setters
        public Long getChatRoomId() {
            return chatRoomId;
        }

        public void setChatRoomId(Long chatRoomId) {
            this.chatRoomId = chatRoomId;
        }
    }

    private static class TypingNotification {
        private Long senderId;
        private Long receiverId;
        private Long chatRoomId;
        private boolean typing;
        private long timestamp;

        public TypingNotification(Long senderId, Long receiverId, Long chatRoomId, boolean typing) {
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.chatRoomId = chatRoomId;
            this.typing = typing;
            this.timestamp = System.currentTimeMillis();
        }

        // Getters and setters
        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }

        public Long getChatRoomId() {
            return chatRoomId;
        }

        public void setChatRoomId(Long chatRoomId) {
            this.chatRoomId = chatRoomId;
        }

        public boolean isTyping() {
            return typing;
        }

        public void setTyping(boolean typing) {
            this.typing = typing;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    private static class ReadReceipt {
        private Long userId;
        private Long chatRoomId;
        private long readAt;

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

    private static class ErrorMessage {
        private String error;
        private long timestamp;

        public ErrorMessage(String error) {
            this.error = error;
            this.timestamp = System.currentTimeMillis();
        }

        // Getters
        public String getError() {
            return error;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}