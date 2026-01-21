package com.chatapp.controller;

import com.chatapp.dto.response.ApiResponse;
import com.chatapp.entity.UserSettings;
import com.chatapp.service.SettingsService;
import com.chatapp.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping

    public ResponseEntity<ApiResponse<UserSettings>> getUserSettings() {
        Long userId = SecurityUtil.getCurrentUserId();
        UserSettings response = settingsService.getUserSettings(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse<UserSettings>> updateNotificationSettings(
            @RequestBody UserSettings settingsUpdate) {

        Long userId = SecurityUtil.getCurrentUserId();
        UserSettings response = settingsService.updateNotificationSettings(userId, settingsUpdate);
        return ResponseEntity.ok(ApiResponse.success("Notification settings updated", response));
    }

    @PutMapping("/privacy")
    public ResponseEntity<ApiResponse<UserSettings>> updatePrivacySettings(
            @RequestBody UserSettings settingsUpdate) {

        Long userId = SecurityUtil.getCurrentUserId();
        UserSettings response = settingsService.updatePrivacySettings(userId, settingsUpdate);
        return ResponseEntity.ok(ApiResponse.success("Privacy settings updated", response));
    }

    @PutMapping("/security")
    public ResponseEntity<ApiResponse<UserSettings>> updateSecuritySettings(
            @RequestBody UserSettings settingsUpdate) {

        Long userId = SecurityUtil.getCurrentUserId();
        UserSettings response = settingsService.updateSecuritySettings(userId, settingsUpdate);
        return ResponseEntity.ok(ApiResponse.success("Security settings updated", response));
    }

    @PutMapping("/theme")
    public ResponseEntity<ApiResponse<UserSettings>> updateTheme(
            @RequestParam String theme) {

        Long userId = SecurityUtil.getCurrentUserId();
        UserSettings response = settingsService.updateTheme(userId, theme);
        return ResponseEntity.ok(ApiResponse.success("Theme updated", response));
    }

    @PostMapping("/two-factor/enable")
    public ResponseEntity<ApiResponse<Void>> enableTwoFactor() {
        Long userId = SecurityUtil.getCurrentUserId();
        UserSettings settings = new UserSettings();
        settings.setTwoFactorEnabled(true);
        settingsService.updateSecuritySettings(userId, settings);

        return ResponseEntity.ok(ApiResponse.success("Two-factor authentication enabled", null));
    }

    @PostMapping("/two-factor/disable")
    public ResponseEntity<ApiResponse<Void>> disableTwoFactor() {
        Long userId = SecurityUtil.getCurrentUserId();
        UserSettings settings = new UserSettings();
        settings.setTwoFactorEnabled(false);
        settingsService.updateSecuritySettings(userId, settings);

        return ResponseEntity.ok(ApiResponse.success("Two-factor authentication disabled", null));
    }
}