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

    private UserResponseDto mapToResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setBio(user.getBio());
        dto.setOnline(user.getOnline());
        dto.setNotificationsEnabled(user.getNotificationsEnabled()); // AGREGAR ESTO
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    @Override
    public UserResponseDto updateUser(Long userId, UserUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar nombre de usuario único si se está cambiando
        if (!user.getUsername().equals(updateDto.getUsername())) {
            if (userRepository.existsByUsername(updateDto.getUsername())) {
                throw new RuntimeException("El nombre de usuario ya está en uso");
            }
        }

        user.setUsername(updateDto.getUsername());
        user.setBio(updateDto.getBio());
        user.setProfilePhotoUrl(updateDto.getProfilePhotoUrl());

        User updatedUser = userRepository.save(user);
        return mapToResponseDto(updatedUser);
    }

    @Override
    public void changePassword(Long userId, UserChangePasswordDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 1. Verificar que la contraseña antigua sea correcta
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // 2. Encriptar y guardar la nueva
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}