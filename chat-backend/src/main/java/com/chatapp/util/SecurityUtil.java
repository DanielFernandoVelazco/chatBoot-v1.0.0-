package com.chatapp.util;

import com.chatapp.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class SecurityUtil {

    @Value("${app.security.development-mode:false}")
    private boolean developmentMode;

    @Value("${app.security.default-user-id:1}")
    private Long defaultUserId;

    private static boolean STATIC_DEV_MODE;
    private static Long STATIC_DEFAULT_USER_ID;

    @PostConstruct
    public void init() {
        STATIC_DEV_MODE = developmentMode;
        STATIC_DEFAULT_USER_ID = defaultUserId;
    }

    public static Long getCurrentUserId() {
        try {
            if (STATIC_DEV_MODE) {
                System.out.println("⚠️  MODO DESARROLLO: Usando userId por defecto: " + STATIC_DEFAULT_USER_ID);
                return STATIC_DEFAULT_USER_ID;
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                return userPrincipal.getId();
            }

        } catch (Exception e) {
            System.err.println("Error en getCurrentUserId: " + e.getMessage());

            if (STATIC_DEV_MODE) {
                return STATIC_DEFAULT_USER_ID;
            }
        }

        throw new RuntimeException("User not authenticated or UserPrincipal not found");
    }

    public static String getCurrentUsername() {
        try {
            if (STATIC_DEV_MODE) {
                return "dev_user";
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                return userPrincipal.getUsername();
            }

        } catch (Exception e) {
            if (STATIC_DEV_MODE) {
                return "dev_user";
            }
        }

        throw new RuntimeException("User not authenticated");
    }

    // Método para extraer userId de header (para desarrollo)
    public static Long extractUserIdFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // En desarrollo, puedes pasar el userId como parte del token
            // Ejemplo: "Bearer user:1"
            String token = authHeader.substring(7);
            if (token.contains("user:")) {
                try {
                    return Long.parseLong(token.split(":")[1]);
                } catch (Exception e) {
                    // Si falla, usar default
                }
            }
        }

        return STATIC_DEV_MODE ? STATIC_DEFAULT_USER_ID : null;
    }
}