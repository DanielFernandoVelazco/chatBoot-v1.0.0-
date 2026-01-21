package com.chatapp.controller;

import com.chatapp.dto.request.UpdateProfileRequest;
import com.chatapp.dto.response.ApiResponse;
import com.chatapp.dto.response.UserResponse;
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
}