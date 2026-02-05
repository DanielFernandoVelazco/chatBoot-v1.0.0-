package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AIRequestDto {
    private String model;
    private List<Message> messages;

    @Data
    public static class Message {
        private String role; // "system", "user", "assistant"
        private String content;
    }
}