package com.chatapp.service;

import com.chatapp.dto.AuthRequest;
import com.chatapp.dto.AuthResponse;
import com.chatapp.dto.RegisterRequest;
import com.chatapp.model.User;
import com.chatapp.repository.UserRepository;
import com.chatapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Verificar si el usuario ya existe
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear nuevo usuario
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .bio(request.getBio())
                .status("OFFLINE")
                .profilePicture("https://via.placeholder.com/150") // Imagen por defecto
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .privacySettings(User.PrivacySettings.builder()
                        .lastSeenVisibility("EVERYONE")
                        .profilePictureVisibility("EVERYONE")
                        .infoVisibility("EVERYONE")
                        .readReceipts(true)
                        .build())
                .notificationSettings(User.NotificationSettings.builder()
                        .desktopNotifications(true)
                        .soundEnabled(true)
                        .notificationTone("default")
                        .messageNotificationType("ALL")
                        .doNotDisturb(false)
                        .build())
                .build();

        User savedUser = userRepository.save(user);

        // Generar token JWT
        String token = jwtUtil.generateToken(
                new org.springframework.security.core.userdetails.User(
                        savedUser.getUsername(),
                        savedUser.getPassword(),
                        java.util.Collections.emptyList()));

        return AuthResponse.builder()
                .token(token)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .message("Usuario registrado exitosamente")
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar estado a ONLINE
        user.setStatus("ONLINE");
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Login exitoso")
                .build();
    }
}