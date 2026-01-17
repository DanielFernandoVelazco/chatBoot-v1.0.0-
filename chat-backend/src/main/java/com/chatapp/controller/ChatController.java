package com.chatapp.controller;

import com.chatapp.dto.request.MessageRequest;
import com.chatapp.dto.response.ApiResponse;
import com.chatapp.dto.response.ChatResponse;
import com.chatapp.dto.response.MessageResponse;
import com.chatapp.service.ChatService;
import com.chatapp.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/chats")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getUserChats() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<ChatResponse> response = chatService.getUserChats(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getChatMessages(
            @PathVariable Long chatId) {

        Long userId = SecurityUtil.getCurrentUserId();
        List<MessageResponse> response = chatService.getChatMessages(chatId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody MessageRequest request) {

        Long userId = SecurityUtil.getCurrentUserId();
        MessageResponse response = chatService.sendMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Message sent", response));
    }

    @PostMapping("/{chatId}/read")
    public ResponseEntity<ApiResponse<Void>> markMessagesAsRead(
            @PathVariable Long chatId) {

        Long userId = SecurityUtil.getCurrentUserId();
        chatService.markMessagesAsRead(chatId, userId);
        return ResponseEntity.ok(ApiResponse.success("Messages marked as read", null));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ApiResponse<ChatResponse>> getChatRoom(
            @PathVariable Long chatId) {

        Long userId = SecurityUtil.getCurrentUserId();
        ChatResponse response = chatService.getChatRoom(chatId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/group")
    public ResponseEntity<ApiResponse<ChatResponse>> createGroupChat(
            @RequestParam String name,
            @RequestParam List<Long> participantIds) {

        Long userId = SecurityUtil.getCurrentUserId();
        chatService.createGroupChat(name, participantIds, userId);
        return ResponseEntity.ok(ApiResponse.success("Group chat created", null));
    }
}