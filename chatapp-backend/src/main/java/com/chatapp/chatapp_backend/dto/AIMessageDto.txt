package com.chatapp.chatapp_backend.dto;

import lombok.Data;

@Data
public class AIMessageDto {
    private String role;
    private String content;
}