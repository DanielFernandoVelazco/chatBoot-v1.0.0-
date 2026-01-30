package com.chatapp.chatapp_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserChangePasswordDto {
    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;
}