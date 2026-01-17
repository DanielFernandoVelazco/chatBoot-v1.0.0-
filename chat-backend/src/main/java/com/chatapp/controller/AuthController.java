package com.chatapp.controller;

import com.chatapp.dto.request.LoginRequest;
import com.chatapp.dto.request.RegisterRequest;
import com.chatapp.dto.response.ApiResponse;
import com.chatapp.dto.response.AuthResponse;
import com.chatapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}