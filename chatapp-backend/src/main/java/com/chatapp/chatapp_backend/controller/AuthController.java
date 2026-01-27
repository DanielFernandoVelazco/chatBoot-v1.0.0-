package com.chatapp.chatapp_backend.controller;

import com.chatapp.chatapp_backend.dto.UserRegistrationDto;
import com.chatapp.chatapp_backend.dto.UserResponseDto;
import com.chatapp.chatapp_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            UserResponseDto newUser = userService.registerUser(registrationDto);
            // Usamos el método estático .status() y .body() para evitar el error de
            // ambigüedad
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (RuntimeException e) {
            // Retornamos BAD_REQUEST sin cuerpo
            return ResponseEntity.badRequest().build();
        }
    }
}