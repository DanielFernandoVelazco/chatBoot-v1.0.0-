package com.chatapp.service;

import com.chatapp.dto.request.LoginRequest;
import com.chatapp.dto.request.RegisterRequest;
import com.chatapp.dto.response.AuthResponse;
import com.chatapp.entity.User;
import com.chatapp.entity.UserSettings;
import com.chatapp.repository.UserRepository;
import com.chatapp.repository.UserSettingsRepository;
import com.chatapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(getDefaultAvatarUrl(request.getUsername()))
                .status("Hey there! I'm using ChatApp")
                .online(false)
                .lastSeen(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        // Create default settings
        UserSettings settings = UserSettings.builder()
                .user(user)
                .showLastSeen(true)
                .showProfilePhoto(true)
                .showStatus(true)
                .profileVisibility("EVERYONE")
                .desktopNotifications(true)
                .soundNotifications(true)
                .doNotDisturb(false)
                .notificationTone("DEFAULT")
                .notificationType("ALL")
                .twoFactorEnabled(false)
                .theme("SYSTEM")
                .build();

        settingsRepository.save(settings);
        user.setSettings(settings);

        // Generate token
        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .online(user.isOnline())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()));

        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        // Update user status
        user.setOnline(true);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .online(user.isOnline())
                .message("Login successful")
                .build();
    }

    public void logout(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setOnline(false);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    private String getDefaultAvatarUrl(String username) {
        // In production, use a proper avatar service
        return "https://ui-avatars.com/api/?name=" + username + "&background=2b6cee&color=fff";
    }
}