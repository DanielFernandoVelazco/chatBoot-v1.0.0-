package com.chatapp.controller;

import com.chatapp.dto.request.UpdateProfileRequest;
import com.chatapp.dto.response.ApiResponse;
import com.chatapp.dto.response.ChatResponse;
import com.chatapp.dto.response.UserResponse;
import com.chatapp.service.ChatService;
import com.chatapp.service.UserService;
import com.chatapp.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ChatService chatService; // Agregar esta línea

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        Long userId = SecurityUtil.getCurrentUserId();
        UserResponse response = userService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        Long userId = SecurityUtil.getCurrentUserId();
        UserResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
            @RequestParam String query) {

        Long userId = SecurityUtil.getCurrentUserId();
        List<UserResponse> response = userService.searchUsers(query, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/online")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getOnlineUsers() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<UserResponse> response = userService.getOnlineUsers(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/presence")
    public ResponseEntity<ApiResponse<Void>> updatePresence(
            @RequestParam boolean online) {

        Long userId = SecurityUtil.getCurrentUserId();
        userService.updateOnlineStatus(userId, online);

        String message = online ? "User is now online" : "User is now offline";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(
            @PathVariable Long userId) {

        // For now, return current user. In future, add privacy checks
        UserResponse response = userService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // ========== ENDPOINTS DE DESARROLLO ==========

    @GetMapping("/dev/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserDev(
            @RequestParam(defaultValue = "1") Long userId) {

        System.out.println("🔧 ENDPOINT DESARROLLO: Obteniendo usuario con ID: " + userId);
        UserResponse response = userService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Development endpoint", response));
    }

    @GetMapping("/dev/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsersDev(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") Long currentUserId) {

        System.out.println("🔧 ENDPOINT DESARROLLO: Buscando usuarios con query: " + query);
        List<UserResponse> response = userService.searchUsers(query, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // NOTA: El endpoint /dev/chats NO debería estar aquí, debería estar en
    // ChatController
    // Si lo quieres aquí, necesitas inyectar ChatService
    // Por ahora, lo voy a comentar o eliminar
}