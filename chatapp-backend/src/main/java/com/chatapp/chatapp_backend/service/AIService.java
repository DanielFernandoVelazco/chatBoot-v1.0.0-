package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.AIMessageDto;
import com.chatapp.chatapp_backend.dto.AIRequestDto;
import com.chatapp.chatapp_backend.dto.AIResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final RestTemplate restTemplate;

    // INYECCIÓN DE PROPIEDADES DIRECTAS (Desde application.yaml)
    @Value("${ai.provider-url}")
    private String providerUrl;

    @Value("${ai.model-name}")
    private String modelName;

    @Value("${ai.api-key}")
    private String apiKey;

    @Value("${ai.system-prompt}")
    private String systemPrompt;

    // CONSTRUCTOR SIMPLIFICADO
    public AIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateResponse(String userMessage, String conversationHistoryJson) {
        try {
            // 1. Construir URL
            String url = providerUrl + "/chat/completions";

            // 2. Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // 3. Mensajes
            AIMessageDto systemMsg = new AIMessageDto();
            systemMsg.setRole("system");
            systemMsg.setContent(systemPrompt);

            AIMessageDto userMsg = new AIMessageDto();
            userMsg.setRole("user");
            userMsg.setContent(userMessage);

            List<AIMessageDto> messagesList = new ArrayList<>();
            messagesList.add(systemMsg);
            messagesList.add(userMsg);

            // 4. Request Body
            AIRequestDto request = new AIRequestDto(modelName, messagesList);

            // 5. Petición
            HttpEntity<AIRequestDto> entity = new HttpEntity<>(request, headers);
            ResponseEntity<AIResponseDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AIResponseDto.class
            );

            // 6. Respuesta
            if (response.getBody() != null && !response.getBody().getChoices().isEmpty()) {
                return response.getBody().getChoices().get(0).getMessage().getContent();
            } else {
                return "Lo siento, no pude generar una respuesta.";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error conectando con la IA. Verifica tu API Key y URL.";
        }
    }
}