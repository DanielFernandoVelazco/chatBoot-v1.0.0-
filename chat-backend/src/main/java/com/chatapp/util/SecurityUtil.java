package com.chatapp.util;

import com.chatapp.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    private static final Long DEFAULT_USER_ID = 1L; // john_doe
    private static final String DEFAULT_USERNAME = "john_doe";

    public static Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                return userPrincipal.getId();
            }

            // Si no hay autenticación pero estamos en modo desarrollo, usar default
            if (isDevelopmentMode()) {
                System.out.println("DEBUG: Using default user ID for development");
                return DEFAULT_USER_ID;
            }

        } catch (Exception e) {
            System.err.println("Error getting current user ID: " + e.getMessage());
        }

        throw new RuntimeException("User not authenticated or UserPrincipal not found");
    }

    public static String getCurrentUsername() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                return userPrincipal.getUsername();
            }

            if (isDevelopmentMode()) {
                return DEFAULT_USERNAME;
            }

        } catch (Exception e) {
            System.err.println("Error getting current username: " + e.getMessage());
        }

        throw new RuntimeException("User not authenticated or UserPrincipal not found");
    }

    private static boolean isDevelopmentMode() {
        // Verificar si estamos en desarrollo (seguridad desactivada)
        String profiles = System.getProperty("spring.profiles.active", "");
        return profiles.contains("dev") ||
                Boolean.parseBoolean(System.getProperty("app.security.disabled", "false"));
    }

    // Método para desarrollo: obtener ID específico desde token
    public static Long extractUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // En desarrollo, podemos parsear el token básicamente
            // O simplemente devolver un ID por defecto
            return DEFAULT_USER_ID;
        }
        return null;
    }
}