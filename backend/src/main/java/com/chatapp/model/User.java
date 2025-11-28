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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String fullName;
    private String bio;
    private String profilePicture;
    private String status; // ONLINE, OFFLINE, AWAY, etc.

    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Configuración de privacidad
    private PrivacySettings privacySettings;

    // Configuración de notificaciones
    private NotificationSettings notificationSettings;

    // Lista de contactos (IDs de otros usuarios)
    private List<String> contacts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PrivacySettings {
        private String lastSeenVisibility; // EVERYONE, CONTACTS, NOBODY
        private String profilePictureVisibility; // EVERYONE, CONTACTS, NOBODY
        private String infoVisibility; // EVERYONE, CONTACTS, NOBODY
        private Boolean readReceipts; // Confirmaciones de lectura
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationSettings {
        private Boolean desktopNotifications;
        private Boolean soundEnabled;
        private String notificationTone;
        private String messageNotificationType; // ALL, MENTIONS, NONE
        private Boolean doNotDisturb;
    }
}