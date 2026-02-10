package com.chatapp.chatapp_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long id;
    private String username;
    private String email;
    private String profilePhotoUrl;
    private String bio;
    private String content;
    private Boolean online;
    private LocalDateTime createdAt;
    private Boolean notificationsEnabled;
}