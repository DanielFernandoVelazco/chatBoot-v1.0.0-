package com.chatapp.chatapp_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (necesario para APIs REST sin formularios)
                .csrf(csrf -> csrf.disable())
                // Habilitar CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        // PERMITE Auth y Mensajes
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/messages/**").permitAll()

                        // PERMITE WEBSOCKET (AGREGAR ESTO)
                        .requestMatchers("/ws-chat/**").permitAll()

                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuración para permitir peticiones desde React (Frontend)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // CAMBIO: Usar origen explícito en lugar de *
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // IMPORTANTE: Habilitar credenciales explícitamente
        configuration.setAllowCredentials(true);

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}