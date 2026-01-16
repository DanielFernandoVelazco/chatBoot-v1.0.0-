package com.chatapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Privacy settings
    private boolean showLastSeen = true;
    private boolean showProfilePhoto = true;
    private boolean showStatus = true;
    private String profileVisibility = "EVERYONE"; // EVERYONE, CONTACTS, NOBODY

    // Notification settings
    private boolean desktopNotifications = true;
    private boolean soundNotifications = true;
    private boolean doNotDisturb = false;
    private String notificationTone = "DEFAULT";
    private String notificationType = "ALL"; // ALL, MENTIONS, NONE

    // Security settings
    private boolean twoFactorEnabled = false;

    // Theme
    private String theme = "SYSTEM"; // LIGHT, DARK, SYSTEM
}