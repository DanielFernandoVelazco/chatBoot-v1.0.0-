package com.chatapp.service;

import com.chatapp.model.Chat;
import com.chatapp.model.User;
import com.chatapp.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserService userService;

    public Chat createPrivateChat(String otherUserId) {
        User currentUser = userService.getCurrentUser();
        User otherUser = userService.getUserById(otherUserId);

        // Verificar si ya existe un chat privado entre estos usuarios
        Optional<Chat> existingChat = chatRepository.findPrivateChatBetweenUsers(
                currentUser.getId(), otherUserId);

        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        Chat chat = Chat.builder()
                .type(Chat.ChatType.PRIVATE)
                .participantIds(List.of(currentUser.getId(), otherUserId))
                .createdBy(currentUser.getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .settings(Chat.ChatSettings.builder()
                        .notificationsEnabled(true)
                        .customNotificationTone("default")
                        .isArchived(false)
                        .isPinned(false)
                        .build())
                .build();

        return chatRepository.save(chat);
    }

    public Chat createGroupChat(String name, String description, List<String> participantIds) {
        User currentUser = userService.getCurrentUser();

        // Agregar al creador como participante
        if (!participantIds.contains(currentUser.getId())) {
            participantIds.add(currentUser.getId());
        }

        Chat chat = Chat.builder()
                .type(Chat.ChatType.GROUP)
                .name(name)
                .description(description)
                .participantIds(participantIds)
                .createdBy(currentUser.getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .settings(Chat.ChatSettings.builder()
                        .notificationsEnabled(true)
                        .customNotificationTone("default")
                        .isArchived(false)
                        .isPinned(false)
                        .build())
                .build();

        return chatRepository.save(chat);
    }

    public List<Chat> getUserChats() {
        User currentUser = userService.getCurrentUser();
        return chatRepository.findByParticipantId(currentUser.getId());
    }

    public Optional<Chat> getChatById(String chatId) {
        return chatRepository.findById(chatId);
    }

    public Chat updateChatSettings(String chatId, Chat.ChatSettings settings) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado"));

        chat.setSettings(settings);
        chat.setUpdatedAt(LocalDateTime.now());

        return chatRepository.save(chat);
    }

    public void archiveChat(String chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado"));

        chat.getSettings().setIsArchived(true);
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);
    }

    public void pinChat(String chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado"));

        chat.getSettings().setIsPinned(true);
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);
    }

    public void unpinChat(String chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado"));

        chat.getSettings().setIsPinned(false);
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);
    }

    public Optional<Chat> getPrivateChatBetweenUsers(String user1Id, String user2Id) {
        return chatRepository.findPrivateChatBetweenUsers(user1Id, user2Id);
    }
}