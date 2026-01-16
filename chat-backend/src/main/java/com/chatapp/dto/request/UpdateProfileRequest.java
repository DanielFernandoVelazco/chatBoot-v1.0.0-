package com.chatapp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String fullName;
    private String avatarUrl;
    private String bio;
    private String status;

    // Settings fields
    private Boolean showLastSeen;
    private Boolean showProfilePhoto;
    private Boolean showStatus;
    private String profileVisibility;

    private Boolean desktopNotifications;
    private Boolean soundNotifications;
    private Boolean doNotDisturb;
    private String notificationTone;
    private String notificationType;

    private Boolean twoFactorEnabled;
    private String theme;
}