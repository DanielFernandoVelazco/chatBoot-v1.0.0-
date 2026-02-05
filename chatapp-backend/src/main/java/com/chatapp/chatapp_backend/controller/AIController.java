package com.chatapp.chatapp_backend.controller;

import com.chatapp.chatapp_backend.dto.UserResponseDto; // Reutilizamos DTO existente
import com.chatapp.chatapp_backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<UserResponseDto> chatWithAI(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");

        String aiResponse = aiService.generateResponse(userMessage, "[]");

        // Construimos una respuesta DTO para simular un usuario "Bot"
        UserResponseDto botResponse = new UserResponseDto();
        botResponse.setId(-1L); // ID -1 indica que es una IA
        botResponse.setUsername("Asistente AI");
        botResponse.setContent(aiResponse);
        botResponse.setCreatedAt(java.time.LocalDateTime.now());

        return ResponseEntity.ok(botResponse);
    }
}