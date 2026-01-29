package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.UserRegistrationDto;
import com.chatapp.chatapp_backend.dto.UserResponseDto;
import com.chatapp.chatapp_backend.model.User;
import com.chatapp.chatapp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos el encriptador

    @Override
    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());

        // ENCRIPTAR CONTRASEÑA ANTES DE GUARDAR
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

    // Nuevo método para el Login
    @Override
    public UserResponseDto loginUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar la contraseña encriptada
        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            // Aquí en el futuro generaríamos un Token (JWT)
            // Por ahora devolvemos el usuario
            return mapToResponseDto(user);
        } else {
            throw new RuntimeException("Contraseña incorrecta");
        }
    }

    private UserResponseDto mapToResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setBio(user.getBio());
        dto.setOnline(user.getOnline());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}