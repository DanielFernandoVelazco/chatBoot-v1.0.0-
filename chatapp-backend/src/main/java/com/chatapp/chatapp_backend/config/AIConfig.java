package com.chatapp.chatapp_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "ai")
public class AIConfig {
    private String providerUrl;
    private String modelName;
    private String apiKey;
    private String systemPrompt;
}