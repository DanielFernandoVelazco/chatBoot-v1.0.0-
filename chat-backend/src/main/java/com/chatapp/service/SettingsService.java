package com.chatapp.service;

import com.chatapp.entity.UserSettings;
import com.chatapp.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserSettingsRepository settingsRepository;

    public UserSettings getUserSettings(Long userId) {
        return settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));
    }

    public UserSettings updateNotificationSettings(Long userId, UserSettings settingsUpdate) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        if (settingsUpdate.isDesktopNotifications() != settings.isDesktopNotifications()) {
            settings.setDesktopNotifications(settingsUpdate.isDesktopNotifications());
        }

        if (settingsUpdate.isSoundNotifications() != settings.isSoundNotifications()) {
            settings.setSoundNotifications(settingsUpdate.isSoundNotifications());
        }

        if (settingsUpdate.isDoNotDisturb() != settings.isDoNotDisturb()) {
            settings.setDoNotDisturb(settingsUpdate.isDoNotDisturb());
        }

        if (settingsUpdate.getNotificationTone() != null &&
                !settingsUpdate.getNotificationTone().equals(settings.getNotificationTone())) {
            settings.setNotificationTone(settingsUpdate.getNotificationTone());
        }

        if (settingsUpdate.getNotificationType() != null &&
                !settingsUpdate.getNotificationType().equals(settings.getNotificationType())) {
            settings.setNotificationType(settingsUpdate.getNotificationType());
        }

        return settingsRepository.save(settings);
    }

    public UserSettings updatePrivacySettings(Long userId, UserSettings settingsUpdate) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        if (settingsUpdate.isShowLastSeen() != settings.isShowLastSeen()) {
            settings.setShowLastSeen(settingsUpdate.isShowLastSeen());
        }

        if (settingsUpdate.isShowProfilePhoto() != settings.isShowProfilePhoto()) {
            settings.setShowProfilePhoto(settingsUpdate.isShowProfilePhoto());
        }

        if (settingsUpdate.isShowStatus() != settings.isShowStatus()) {
            settings.setShowStatus(settingsUpdate.isShowStatus());
        }

        if (settingsUpdate.getProfileVisibility() != null &&
                !settingsUpdate.getProfileVisibility().equals(settings.getProfileVisibility())) {
            settings.setProfileVisibility(settingsUpdate.getProfileVisibility());
        }

        return settingsRepository.save(settings);
    }

    public UserSettings updateSecuritySettings(Long userId, UserSettings settingsUpdate) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        if (settingsUpdate.isTwoFactorEnabled() != settings.isTwoFactorEnabled()) {
            settings.setTwoFactorEnabled(settingsUpdate.isTwoFactorEnabled());
        }

        return settingsRepository.save(settings);
    }

    public UserSettings updateTheme(Long userId, String theme) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        settings.setTheme(theme);
        return settingsRepository.save(settings);
    }
}