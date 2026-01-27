package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.UserRegistrationDto;
import com.chatapp.chatapp_backend.dto.UserResponseDto;

public interface UserService {
    UserResponseDto registerUser(UserRegistrationDto registrationDto);

    UserResponseDto findByEmail(String email);
}