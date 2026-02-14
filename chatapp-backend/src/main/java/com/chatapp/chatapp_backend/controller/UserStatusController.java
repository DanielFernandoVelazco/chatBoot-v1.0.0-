package com.chatapp.chatapp_backend.controller;

import com.chatapp.chatapp_backend.dto.UserResponseDto;
import com.chatapp.chatapp_backend.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class UserStatusController {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/user.status")
    public void updateUserStatus(@Payload Map<String, Object> statusUpdate) {
        Long userId = Long.valueOf(statusUpdate.get("userId").toString());
        boolean online = (boolean) statusUpdate.get("online");

        // Actualizar estado en base de datos
        userService.setUserOnline(userId, online);

        // Obtener usuario actualizado
        UserResponseDto user = userService.findByEmail(
                userService.getUserById(userId).getEmail() // Necesitamos agregar este método
        );

        // Notificar a todos los contactos sobre el cambio de estado
        messagingTemplate.convertAndSend("/topic/user-status", user);
    }
}