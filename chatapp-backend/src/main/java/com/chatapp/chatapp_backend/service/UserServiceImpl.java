package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.UserChangePasswordDto;
import com.chatapp.chatapp_backend.dto.UserRegistrationDto;
import com.chatapp.chatapp_backend.dto.UserResponseDto;
import com.chatapp.chatapp_backend.dto.UserUpdateDto;
import com.chatapp.chatapp_backend.model.User;
import com.chatapp.chatapp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setOnline(false);
        user.setAllowLastSeen(true); // NUEVO: Por defecto activado
        user.setLastSeen(LocalDateTime.now()); // NUEVO

        User savedUser = userRepository.save(user);
        return mapToResponseDto(savedUser);
    }

    @Override
    public UserResponseDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return mapToResponseDto(user);
    }

    @Override
    public UserResponseDto loginUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            // NUEVO: Actualizar lastSeen al iniciar sesión
            user.setLastSeen(LocalDateTime.now());
            user.setOnline(true);
            userRepository.save(user);

            return mapToResponseDto(user);
        } else {
            throw new RuntimeException("Contraseña incorrecta");
        }
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDto updateUser(Long userId, UserUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar nombre de usuario único si se está cambiando
        if (updateDto.getUsername() != null && !user.getUsername().equals(updateDto.getUsername())) {
            if (userRepository.existsByUsername(updateDto.getUsername())) {
                throw new RuntimeException("El nombre de usuario ya está en uso");
            }
            user.setUsername(updateDto.getUsername());
        }

        if (updateDto.getBio() != null) {
            user.setBio(updateDto.getBio());
        }

        if (updateDto.getProfilePhotoUrl() != null) {
            user.setProfilePhotoUrl(updateDto.getProfilePhotoUrl());
        }

        // NUEVO: Actualizar configuración de privacidad
        if (updateDto.getAllowLastSeen() != null) {
            user.setAllowLastSeen(updateDto.getAllowLastSeen());
        }

        if (updateDto.getNotificationsEnabled() != null) {
            user.setNotificationsEnabled(updateDto.getNotificationsEnabled());
        }

        User updatedUser = userRepository.save(user);
        return mapToResponseDto(updatedUser);
    }

    @Override
    public void changePassword(Long userId, UserChangePasswordDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    // NUEVO: Método para actualizar lastSeen cuando el usuario cierra sesión o se desconecta
    public void updateUserLastSeen(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setLastSeen(LocalDateTime.now());
        user.setOnline(false);
        userRepository.save(user);
    }

    // NUEVO: Método para actualizar estado online
    public void setUserOnline(Long userId, boolean online) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setOnline(online);
        if (!online) {
            user.setLastSeen(LocalDateTime.now());
        }
        userRepository.save(user);
    }

    // AGREGAR ESTE MÉTODO A UserServiceImpl.java
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private UserResponseDto mapToResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setBio(user.getBio());
        dto.setOnline(user.getOnline());
        dto.setNotificationsEnabled(user.getNotificationsEnabled());
        dto.setCreatedAt(user.getCreatedAt());

        // NUEVO: Mapear campos de privacidad y última vez
        dto.setAllowLastSeen(user.getAllowLastSeen());
        dto.setLastSeen(user.getLastSeen());
        dto.setLastSeenText(formatLastSeen(user.getLastSeen(), user.getOnline(), user.getAllowLastSeen()));

        return dto;
    }

    // NUEVO: Método para formatear "última vez visto"
    private String formatLastSeen(LocalDateTime lastSeen, Boolean isOnline, Boolean allowLastSeen) {
        if (isOnline) {
            return "En línea";
        }

        if (!allowLastSeen) {
            return "Oculto";
        }

        if (lastSeen == null) {
            return "Visto recientemente";
        }

        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(lastSeen, now);
        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) {
            return "Visto ahora mismo";
        } else if (minutes < 60) {
            return "Visto hace " + minutes + " minuto" + (minutes != 1 ? "s" : "");
        } else if (hours < 24) {
            return "Visto hace " + hours + " hora" + (hours != 1 ? "s" : "");
        } else if (days < 7) {
            return "Visto hace " + days + " día" + (days != 1 ? "s" : "");
        } else {
            return "Visto el " + lastSeen.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }
    }
}