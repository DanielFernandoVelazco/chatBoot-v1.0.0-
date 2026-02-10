package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequestDto {
    private Long senderId;   // Quien envía (por ahora lo mandamos del frontend hasta tener JWT)
    private Long receiverId; // Quien recibe
    private String content;  // El texto
}