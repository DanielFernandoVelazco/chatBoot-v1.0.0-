package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDto {
    private Long id;
    private Long senderId;
    private String content; // Agregaremos senderName después si es necesario
    private LocalDateTime timestamp;
}