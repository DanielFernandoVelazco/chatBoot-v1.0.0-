package com.chatapp.service;

import com.chatapp.dto.request.UpdateProfileRequest;
import com.chatapp.dto.response.UserResponse;
import com.chatapp.entity.User;
import com.chatapp.entity.UserSettings;
import com.chatapp.repository.UserRepository;
import com.chatapp.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;

    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToResponse(user);
    }

    public List<UserResponse> searchUsers(String searchTerm, Long currentUserId) {
        return userRepository.searchUsers(searchTerm).stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getOnlineUsers(Long currentUserId) {
        return userRepository.findByOnlineTrue().stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        // Update user fields
        if (request.getFullName() != null)
            user.setFullName(request.getFullName());
        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());
        if (request.getBio() != null)
            user.setBio(request.getBio());
        if (request.getStatus() != null)
            user.setStatus(request.getStatus());

        // Update settings
        if (request.getShowLastSeen() != null)
            settings.setShowLastSeen(request.getShowLastSeen());
        if (request.getShowProfilePhoto() != null)
            settings.setShowProfilePhoto(request.getShowProfilePhoto());
        if (request.getShowStatus() != null)
            settings.setShowStatus(request.getShowStatus());
        if (request.getProfileVisibility() != null)
            settings.setProfileVisibility(request.getProfileVisibility());

        if (request.getDesktopNotifications() != null)
            settings.setDesktopNotifications(request.getDesktopNotifications());
        if (request.getSoundNotifications() != null)
            settings.setSoundNotifications(request.getSoundNotifications());
        if (request.getDoNotDisturb() != null)
            settings.setDoNotDisturb(request.getDoNotDisturb());
        if (request.getNotificationTone() != null)
            settings.setNotificationTone(request.getNotificationTone());
        if (request.getNotificationType() != null)
            settings.setNotificationType(request.getNotificationType());

        if (request.getTwoFactorEnabled() != null)
            settings.setTwoFactorEnabled(request.getTwoFactorEnabled());
        if (request.getTheme() != null)
            settings.setTheme(request.getTheme());

        userRepository.save(user);
        settingsRepository.save(settings);

        return convertToResponse(user);
    }

    public void updateLastSeen(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    public void updateOnlineStatus(Long userId, boolean online) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setOnline(online);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    private UserResponse convertToResponse(User user) {
        UserSettings settings = settingsRepository.findByUserId(user.getId())
                .orElse(UserSettings.builder()
                        .showLastSeen(true)
                        .showProfilePhoto(true)
                        .showStatus(true)
                        .profileVisibility("EVERYONE")
                        .build());

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .status(user.getStatus())
                .online(user.isOnline())
                .lastSeen(user.getLastSeen())
                .createdAt(user.getCreatedAt())
                .showLastSeen(settings.isShowLastSeen())
                .showProfilePhoto(settings.isShowProfilePhoto())
                .showStatus(settings.isShowStatus())
                .profileVisibility(settings.getProfileVisibility())
                .build();
    }
}