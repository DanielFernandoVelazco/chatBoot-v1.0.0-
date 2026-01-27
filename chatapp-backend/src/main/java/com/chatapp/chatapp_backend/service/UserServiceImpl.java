package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.UserRegistrationDto;
import com.chatapp.chatapp_backend.dto.UserResponseDto;
import com.chatapp.chatapp_backend.model.User;
import com.chatapp.chatapp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        // 1. Verificar si el email ya existe
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // 2. Convertir DTO a Entidad
        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(registrationDto.getPassword()); // TODO: Encriptar en paso de Seguridad
        user.setOnline(false);

        // 3. Guardar
        User savedUser = userRepository.save(user);

        // 4. Convertir Entidad a DTO y retornar
        return mapToResponseDto(savedUser);
    }

    @Override
    public UserResponseDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return mapToResponseDto(user);
    }

    // Método auxiliar para mapear manualmente (sin ModelMapper)
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