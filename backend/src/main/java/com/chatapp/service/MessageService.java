package com.chatapp.service;

import com.chatapp.model.Chat;
import com.chatapp.model.Message;
import com.chatapp.model.User;
import com.chatapp.repository.ChatRepository;
import com.chatapp.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserService userService;

    public Message sendMessage(String chatId, String content, Message.MessageType type) {
        User currentUser = userService.getCurrentUser();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado"));

        // Verificar que el usuario es participante del chat
        if (!chat.getParticipantIds().contains(currentUser.getId())) {
            throw new RuntimeException("No eres participante de este chat");
        }

        Message message = Message.builder()
                .chatId(chatId)
                .senderId(currentUser.getId())
                .senderName(currentUser.getFullName())
                .content(content)
                .type(type)
                .timestamp(LocalDateTime.now())
                .deliveryStatus(Message.DeliveryStatus.builder()
                        .delivered(false)
                        .read(false)
                        .build())
                .build();

        Message savedMessage = messageRepository.save(message);

        // Actualizar último mensaje en el chat
        updateChatLastMessage(chat, savedMessage);

        return savedMessage;
    }

    public Page<Message> getChatMessages(String chatId, Pageable pageable) {
        return messageRepository.findByChatIdOrderByTimestampDesc(chatId, pageable);
    }

    public List<Message> getUnreadMessages(String chatId) {
        User currentUser = userService.getCurrentUser();
        return messageRepository.findUnreadMessagesByChatAndUser(chatId, currentUser.getId());
    }

    public void markMessagesAsRead(String chatId) {
        User currentUser = userService.getCurrentUser();
        List<Message> unreadMessages = getUnreadMessages(chatId);

        for (Message message : unreadMessages) {
            message.getDeliveryStatus().setRead(true);
            message.getDeliveryStatus().getReadBy().add(currentUser.getId());
            message.setReadAt(LocalDateTime.now());
        }

        messageRepository.saveAll(unreadMessages);
    }

    public Message editMessage(String messageId, String newContent) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));

        User currentUser = userService.getCurrentUser();

        // Verificar que el usuario es el propietario del mensaje
        if (!message.getSenderId().equals(currentUser.getId())) {
            throw new RuntimeException("No puedes editar este mensaje");
        }

        // Guardar historial de edición
        if (message.getEditInfo() == null) {
            message.setEditInfo(Message.EditInfo.builder()
                    .previousContent(message.getContent())
                    .editedAt(LocalDateTime.now())
                    .editCount(1)
                    .build());
        } else {
            message.getEditInfo().setEditCount(message.getEditInfo().getEditCount() + 1);
            message.getEditInfo().setEditedAt(LocalDateTime.now());
        }

        message.setContent(newContent);

        return messageRepository.save(message);
    }

    public void deleteMessage(String messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));

        User currentUser = userService.getCurrentUser();

        // Verificar que el usuario es el propietario del mensaje
        if (!message.getSenderId().equals(currentUser.getId())) {
            throw new RuntimeException("No puedes eliminar este mensaje");
        }

        messageRepository.delete(message);
    }

    public Message addReaction(String messageId, String emoji) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));

        User currentUser = userService.getCurrentUser();

        // Remover reacción existente del mismo usuario
        message.getReactions().removeIf(reaction -> reaction.getUserId().equals(currentUser.getId()));

        // Agregar nueva reacción
        Message.Reaction reaction = Message.Reaction.builder()
                .userId(currentUser.getId())
                .emoji(emoji)
                .timestamp(LocalDateTime.now())
                .build();

        message.getReactions().add(reaction);

        return messageRepository.save(message);
    }

    private void updateChatLastMessage(Chat chat, Message message) {
        // Convertir Message.MessageType a Chat.MessageType
        Chat.MessageType chatMessageType = convertToChatMessageType(message.getType());

        Chat.LastMessageInfo lastMessage = Chat.LastMessageInfo.builder()
                .messageId(message.getId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .senderName(message.getSenderName())
                .timestamp(message.getTimestamp())
                .messageType(chatMessageType)
                .build();

        chat.setLastMessage(lastMessage);
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);
    }

    // Método auxiliar para convertir entre los tipos
    private Chat.MessageType convertToChatMessageType(Message.MessageType messageType) {
        switch (messageType) {
            case TEXT:
                return Chat.MessageType.TEXT;
            case IMAGE:
                return Chat.MessageType.IMAGE;
            case FILE:
                return Chat.MessageType.FILE;
            case VIDEO:
                return Chat.MessageType.VIDEO;
            case AUDIO:
                return Chat.MessageType.AUDIO;
            case LOCATION:
            case CONTACT:
            case SYSTEM:
                return Chat.MessageType.TEXT; // Por defecto para tipos no mapeados
            default:
                return Chat.MessageType.TEXT;
        }
    }
}