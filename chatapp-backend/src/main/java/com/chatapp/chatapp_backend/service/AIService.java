package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.config.AIConfig;
import com.chatapp.chatapp_backend.dto.AIRequestDto;
import com.chatapp.chatapp_backend.dto.AIResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Autowired
    private AIConfig aiConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(String userMessage, String conversationHistoryJson) {
        try {
            // 1. Construir la URL completa del endpoint
            String url = aiConfig.getProviderUrl() + "/chat/completions";

            // 2. Construir los headers (Autorización Bearer Token)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(aiConfig.getApiKey());

            // 3. Construir el cuerpo de la petición (Formato OpenAI Genérico)
            // Aquí implementamos la "Característica Propietaria": Memoria de Contexto

            // Mensaje del sistema (Persona)
            AIRequestDto.Message systemMsg = new AIRequestDto.Message();
            systemMsg.setRole("system");
            systemMsg.setContent(aiConfig.getSystemPrompt());

            // Mensaje del usuario (Lo que acabas de escribir)
            AIRequestDto.Message userMsg = new AIRequestDto.Message();
            userMsg.setRole("user");
            userMsg.setContent(userMessage);

            // Historial pasado (Si no lo hay, solo el sistema y el usuario)
            List<AIRequestDto.Message> messagesList = new ArrayList<>();
            messagesList.add(systemMsg);
            messagesList.add(userMsg);

            // NOTA: En un caso real, decodificaríamos el JSON de historial
            // y añadiríamos esos mensajes aquí para tener memoria a largo plazo.
            // Por simplicidad en este paso, enviamos solo el mensaje actual + sistema.

            AIRequestDto request = new AIRequestDto();
            request.setModel(aiConfig.getModelName());
            request.setMessages(messagesList);

            // 4. Hacer la petición
            HttpEntity<AIRequestDto> entity = new HttpEntity<>(request, headers);
            ResponseEntity<AIResponseDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AIResponseDto.class
            );

            // 5. Extraer la respuesta
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