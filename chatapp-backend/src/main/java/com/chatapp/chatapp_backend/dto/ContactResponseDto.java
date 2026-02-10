package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponseDto {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String status;
    private LocalDateTime createdAt;
    private String messagePreview; // Primeros 100 caracteres
}