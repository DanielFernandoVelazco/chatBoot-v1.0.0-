package com.chatapp.controller;

import com.chatapp.dto.request.LoginRequest;
import com.chatapp.dto.request.RegisterRequest;
import com.chatapp.dto.response.ApiResponse;
import com.chatapp.dto.response.AuthResponse;
import com.chatapp.security.JwtService;
import com.chatapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader("Authorization") String token) {
        // Token invalidation would be handled by client
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Void>> validateToken(
            @RequestHeader("Authorization") String token) {
        // Token validation is done by JwtAuthenticationFilter
        return ResponseEntity.ok(ApiResponse.success("Token is valid", null));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        response.put("service", "chat-backend");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug")

    public ResponseEntity<Map<String, Object>> debugInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("authentication", auth != null ? auth.getName() : "null");
        response.put("authorities", auth != null ? auth.getAuthorities() : "null");
        response.put("isAuthenticated", auth != null && auth.isAuthenticated());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/public-test")

    public ResponseEntity<Map<String, String>> publicTest() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a public endpoint");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate-test-token")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateTestToken(
            @RequestParam String username) {
        try {
            // Esto es solo para pruebas - en producción usar login normal
            org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(username)
                    .password("dummy")
                    .authorities("ROLE_USER")
                    .build();

            String token = jwtService.generateToken(userDetails);

            Map<String, String> data = new HashMap<>();
            data.put("token", token);
            data.put("username", username);
            data.put("message", "TEST TOKEN ONLY - DO NOT USE IN PRODUCTION");

            return ResponseEntity.ok(ApiResponse.success("Test token generated", data));
        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error generating token: " + e.getMessage()));
        }
    }
}