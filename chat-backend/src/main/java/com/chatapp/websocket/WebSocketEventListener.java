package com.chatapp.websocket;

import com.chatapp.security.UserPrincipal;
import com.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SimpMessageHeaderAccessor
                .getUser(event.getMessage().getHeaders());

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            log.info("User connected: {}", userPrincipal.getUsername());

            // Update online status
            userService.updateOnlineStatus(userId, true);

            // Broadcast user online status
            messagingTemplate.convertAndSend("/topic/presence",
                    new PresenceMessage("ONLINE", userId, userPrincipal.getUsername()));
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SimpMessageHeaderAccessor
                .getUser(event.getMessage().getHeaders());

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            log.info("User disconnected: {}", userPrincipal.getUsername());

            // Update online status
            userService.updateOnlineStatus(userId, false);

            // Broadcast user offline status
            messagingTemplate.convertAndSend("/topic/presence",
                    new PresenceMessage("OFFLINE", userId, userPrincipal.getUsername()));
        }
    }

    // Inner class for presence messages
    private static class PresenceMessage {
        private final String status;
        private final Long userId;
        private final String username;
        private final long timestamp;

        public PresenceMessage(String status, Long userId, String username) {
            this.status = status;
            this.userId = userId;
            this.username = username;
            this.timestamp = System.currentTimeMillis();
        }

        public String getStatus() {
            return status;
        }

        public Long getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}