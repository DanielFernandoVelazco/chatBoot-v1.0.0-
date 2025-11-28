package com.chatapp.controller;

import com.chatapp.dto.SendMessageRequest;
import com.chatapp.model.Message;
import com.chatapp.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{chatId}")
    public ResponseEntity<Message> sendMessage(
            @PathVariable String chatId,
            @RequestBody SendMessageRequest request) {
        Message message = messageService.sendMessage(chatId, request.getContent(), request.getType());
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Page<Message>> getChatMessages(
            @PathVariable String chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageService.getChatMessages(chatId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{chatId}/unread")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable String chatId) {
        List<Message> messages = messageService.getUnreadMessages(chatId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{chatId}/read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable String chatId) {
        messageService.markMessagesAsRead(chatId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<Message> editMessage(
            @PathVariable String messageId,
            @RequestParam String content) {
        Message message = messageService.editMessage(messageId, content);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{messageId}/reaction")
    public ResponseEntity<Message> addReaction(
            @PathVariable String messageId,
            @RequestParam String emoji) {
        Message message = messageService.addReaction(messageId, emoji);
        return ResponseEntity.ok(message);
    }
}