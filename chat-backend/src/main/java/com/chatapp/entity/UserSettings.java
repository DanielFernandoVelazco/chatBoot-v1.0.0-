package com.chatapp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JsonBackReference
    private User user;

    // Privacy settings
    @Builder.Default
    private boolean showLastSeen = true;

    @Builder.Default
    private boolean showProfilePhoto = true;

    @Builder.Default
    private boolean showStatus = true;

    @Builder.Default
    private String profileVisibility = "EVERYONE"; // EVERYONE, CONTACTS, NOBODY

    // Notification settings
    @Builder.Default
    private boolean desktopNotifications = true;

    @Builder.Default
    private boolean soundNotifications = true;

    @Builder.Default
    private boolean doNotDisturb = false;

    @Builder.Default
    private String notificationTone = "DEFAULT";

    @Builder.Default
    private String notificationType = "ALL"; // ALL, MENTIONS, NONE

    // Security settings
    @Builder.Default
    private boolean twoFactorEnabled = false;

    // Theme
    @Builder.Default
    private String theme = "SYSTEM"; // LIGHT, DARK, SYSTEM
}