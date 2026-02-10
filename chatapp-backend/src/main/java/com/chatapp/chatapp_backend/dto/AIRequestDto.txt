package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AIRequestDto {
    private String model;
    private List<AIMessageDto> messages; // Usamos la nueva clase aquí
}