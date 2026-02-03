package com.chatapp.chatapp_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilitar un broker de memoria simple
        config.enableSimpleBroker("/user", "/topic");

        // Definir prefijo para los mensajes que envían los clientes (si lo usáramos)
        config.setApplicationDestinationPrefixes("/app");

        // Prefijo para destinos de usuario específicos
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // El endpoint donde se conectarán los clientes
        registry.addEndpoint("/ws-chat").setAllowedOriginPatterns("*").withSockJS();
    }
}