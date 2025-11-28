package com.chatapp.controller;

import com.chatapp.model.Chat;
import com.chatapp.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/private/{userId}")
    public ResponseEntity<Chat> createPrivateChat(@PathVariable String userId) {
        Chat chat = chatService.createPrivateChat(userId);
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupChat(
            @RequestParam String name,
            @RequestParam String description,
            @RequestBody List<String> participantIds) {
        Chat chat = chatService.createGroupChat(name, description, participantIds);
        return ResponseEntity.ok(chat);
    }

    @GetMapping
    public ResponseEntity<List<Chat>> getUserChats() {
        List<Chat> chats = chatService.getUserChats();
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> getChatById(@PathVariable String chatId) {
        Chat chat = chatService.getChatById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado"));
        return ResponseEntity.ok(chat);
    }

    @PutMapping("/{chatId}/settings")
    public ResponseEntity<Chat> updateChatSettings(
            @PathVariable String chatId,
            @RequestBody Chat.ChatSettings settings) {
        Chat chat = chatService.updateChatSettings(chatId, settings);
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/{chatId}/archive")
    public ResponseEntity<Void> archiveChat(@PathVariable String chatId) {
        chatService.archiveChat(chatId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{chatId}/pin")
    public ResponseEntity<Void> pinChat(@PathVariable String chatId) {
        chatService.pinChat(chatId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{chatId}/unpin")
    public ResponseEntity<Void> unpinChat(@PathVariable String chatId) {
        chatService.unpinChat(chatId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/private/{user1Id}/{user2Id}")
    public ResponseEntity<Chat> getPrivateChatBetweenUsers(
            @PathVariable String user1Id,
            @PathVariable String user2Id) {
        Chat chat = chatService.getPrivateChatBetweenUsers(user1Id, user2Id)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado"));
        return ResponseEntity.ok(chat);
    }
}