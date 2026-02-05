package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.AIMessageDto;
import com.chatapp.chatapp_backend.dto.AIRequestDto;
import com.chatapp.chatapp_backend.dto.AIResponseDto;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final RestTemplate restTemplate;
    private final Environment env; // Inyectamos el entorno directamente

    public AIService(RestTemplate restTemplate, Environment env) {
        this.restTemplate = restTemplate;
        this.env = env;
    }

    public String generateResponse(String userMessage, String conversationHistoryJson) {
        try {
            // 1. Leer propiedades usando Environment (Método robusto)
            String providerUrl = env.getProperty("ai.provider-url");
            String modelName = env.getProperty("ai.model-name");
            String apiKey = env.getProperty("ai.api-key");
            String systemPrompt = env.getProperty("ai.system-prompt");

            // Validación rápida
            if (apiKey == null) {
                return "Error: No se encontró la API Key en el archivo application.yaml";
            }

            // 2. Construir URL
            String url = providerUrl + "/chat/completions";

            // 3. Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // 4. Mensajes
            AIMessageDto systemMsg = new AIMessageDto();
            systemMsg.setRole("system");
            systemMsg.setContent(systemPrompt);

            AIMessageDto userMsg = new AIMessageDto();
            userMsg.setRole("user");
            userMsg.setContent(userMessage);

            List<AIMessageDto> messagesList = new ArrayList<>();
            messagesList.add(systemMsg);
            messagesList.add(userMsg);

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
            return "Error conectando con la IA. Verifica tu API Key.";
        }
    }
}