package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.UserRegistrationDto;
import com.chatapp.chatapp_backend.dto.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto registerUser(UserRegistrationDto registrationDto);
    UserResponseDto findByEmail(String email);

    // AGREGAR ESTA LÍNEA:
    UserResponseDto loginUser(String email, String rawPassword);

    List<UserResponseDto> getAllUsers();
}