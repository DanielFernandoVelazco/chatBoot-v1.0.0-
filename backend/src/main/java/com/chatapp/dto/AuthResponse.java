package com.chatapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;

    @Builder.Default
    private String type = "Bearer";

    private String username;
    private String email;
    private String message;
}