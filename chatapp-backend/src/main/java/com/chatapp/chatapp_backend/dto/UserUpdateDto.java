package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    private String username;
    private String bio;
    private String profilePhotoUrl;
    private Boolean notificationsEnabled;
    private Boolean allowLastSeen; // NUEVO
}