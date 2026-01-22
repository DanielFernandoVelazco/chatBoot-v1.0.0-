package com.chatapp.entity;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference // <-- Agregar esta anotación
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

    // Agregar métodos toString() y hashCode() que eviten recursión
    @Override
    public String toString() {
        return "UserSettings{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", showLastSeen=" + showLastSeen +
                ", theme='" + theme + '\'' +
                '}';
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, showLastSeen, showProfilePhoto, showStatus,
                profileVisibility, desktopNotifications,
                soundNotifications, doNotDisturb, notificationTone,
                notificationType, twoFactorEnabled, theme);
    }
}