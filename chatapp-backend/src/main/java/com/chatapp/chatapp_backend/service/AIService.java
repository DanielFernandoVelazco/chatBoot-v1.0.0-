package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.config.AIConfig;
import com.chatapp.chatapp_backend.dto.AIMessageDto;
import com.chatapp.chatapp_backend.dto.AIRequestDto;
import com.chatapp.chatapp_backend.dto.AIResponseDto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    // CAMBIO: Usamos variables finales para inyección por constructor
    private final AIConfig aiConfig;
    private final RestTemplate restTemplate;

    // INYECCIÓN POR CONSTRUCTOR
    public AIService(AIConfig aiConfig) {
        this.aiConfig = aiConfig;
        this.restTemplate = new RestTemplate();
    }

    public String generateResponse(String userMessage, String conversationHistoryJson) {
        try {
            String url = aiConfig.getProviderUrl() + "/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(aiConfig.getApiKey());

            // Construir mensajes con la clase externa
            AIMessageDto systemMsg = new AIMessageDto();
            systemMsg.setRole("system");
            systemMsg.setContent(aiConfig.getSystemPrompt());

            AIMessageDto userMsg = new AIMessageDto();
            userMsg.setRole("user");
            userMsg.setContent(userMessage);

            List<AIMessageDto> messagesList = new ArrayList<>();
            messagesList.add(systemMsg);
            messagesList.add(userMsg);

            AIRequestDto request = new AIRequestDto(aiConfig.getModelName(), messagesList);

            HttpEntity<AIRequestDto> entity = new HttpEntity<>(request, headers);
            ResponseEntity<AIResponseDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AIResponseDto.class
            );

            if (response.getBody() != null && !response.getBody().getChoices().isEmpty()) {
                return response.getBody().getChoices().get(0).getMessage().getContent();
            } else {
                return "Lo siento, no pude generar una respuesta.";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error conectando con la IA. Verifica tu API Key.";
        }
    }
}