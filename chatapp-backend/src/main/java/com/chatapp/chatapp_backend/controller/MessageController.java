package com.chatapp.chatapp_backend.controller;

import com.chatapp.chatapp_backend.dto.MessageRequestDto;
import com.chatapp.chatapp_backend.dto.MessageResponseDto;
import com.chatapp.chatapp_backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<MessageResponseDto> sendMessage(@RequestBody MessageRequestDto requestDto) {
        MessageResponseDto msg = messageService.sendMessage(requestDto);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<MessageResponseDto>> getConversation(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        List<MessageResponseDto> messages = messageService.getConversation(userId1, userId2);
        return ResponseEntity.ok(messages);
    }
}