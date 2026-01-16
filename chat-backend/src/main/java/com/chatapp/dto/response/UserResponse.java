package com.chatapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private String status;
    private boolean online;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;

    // Settings
    private boolean showLastSeen;
    private boolean showProfilePhoto;
    private boolean showStatus;
    private String profileVisibility;
}