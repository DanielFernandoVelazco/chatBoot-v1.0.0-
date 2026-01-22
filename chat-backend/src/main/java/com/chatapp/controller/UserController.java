package com.chatapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.dto.request.UpdateProfileRequest;
import com.chatapp.dto.response.ApiResponse;
import com.chatapp.dto.response.ChatResponse;
import com.chatapp.dto.response.UserResponse;
import com.chatapp.service.UserService;
import com.chatapp.util.SecurityUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Long targetUserId = userId;

        // Si no se proporciona userId, intentar extraer del token o usar default
        if (targetUserId == null) {
            try {
                targetUserId = SecurityUtil.getCurrentUserId();
            } catch (Exception e) {
                // En desarrollo, usar userId por defecto
                targetUserId = 1L; // john_doe
            }
        }

        UserResponse response = userService.getCurrentUser(targetUserId);
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

    @GetMapping("/dev/chats")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getUserChatsDev(
            @RequestParam(defaultValue = "1") Long userId) {

        System.out.println("🔧 ENDPOINT DESARROLLO: Obteniendo chats para usuario: " + userId);
        List<ChatResponse> response = chatService.getUserChats(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}