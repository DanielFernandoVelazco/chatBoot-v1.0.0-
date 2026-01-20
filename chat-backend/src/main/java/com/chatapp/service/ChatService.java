package com.chatapp.service;

import com.chatapp.dto.request.MessageRequest;
import com.chatapp.dto.response.ChatResponse;
import com.chatapp.dto.response.MessageResponse;
import com.chatapp.dto.response.UserResponse;
import com.chatapp.entity.ChatRoom;
import com.chatapp.entity.Message;
import com.chatapp.entity.User;
import com.chatapp.repository.ChatRoomRepository;
import com.chatapp.repository.MessageRepository;
import com.chatapp.repository.UserRepository;
import com.chatapp.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

        private final MessageRepository messageRepository;
        private final ChatRoomRepository chatRoomRepository;
        private final UserRepository userRepository;
        private final UserSettingsRepository settingsRepository;

        @Transactional
        public MessageResponse sendMessage(MessageRequest request, Long senderId) {
                User sender = userRepository.findById(senderId)
                                .orElseThrow(() -> new RuntimeException("Sender not found"));

                User receiver = userRepository.findById(request.getReceiverId())
                                .orElseThrow(() -> new RuntimeException("Receiver not found"));

                // Find or create chat room
                ChatRoom chatRoom = request.getChatRoomId() != null
                                ? chatRoomRepository.findById(request.getChatRoomId())
                                                .orElseThrow(() -> new RuntimeException("Chat room not found"))
                                : findOrCreatePrivateChatRoom(sender, receiver);

                // Create message
                Message message = Message.builder()
                                .sender(sender)
                                .receiver(receiver)
                                .chatRoom(chatRoom)
                                .content(request.getContent())
                                .messageType(request.getMessageType())
                                .isRead(false)
                                .createdAt(LocalDateTime.now())
                                .build();

                message = messageRepository.save(message);

                // Update chat room last message
                chatRoom.setLastMessage(request.getContent());
                chatRoom.setLastMessageAt(LocalDateTime.now());
                chatRoomRepository.save(chatRoom);

                return convertToMessageResponse(message);
        }

        public List<ChatResponse> getUserChats(Long userId) {
                return chatRoomRepository.findChatRoomsByUserId(userId).stream()
                                .map(this::convertToChatResponse)
                                .collect(Collectors.toList());
        }

        public List<MessageResponse> getChatMessages(Long chatRoomId, Long userId) {
                ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                                .orElseThrow(() -> new RuntimeException("Chat room not found"));

                // Verify user is participant
                boolean isParticipant = chatRoom.getParticipants().stream()
                                .anyMatch(user -> user.getId().equals(userId));

                if (!isParticipant) {
                        throw new RuntimeException("User is not a participant in this chat");
                }

                return messageRepository.findByChatRoomId(chatRoomId).stream()
                                .map(this::convertToMessageResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public void markMessagesAsRead(Long chatRoomId, Long userId) {
                List<Message> unreadMessages = messageRepository.findByChatRoomId(chatRoomId).stream()
                                .filter(message -> message.getReceiver().getId().equals(userId) && !message.isRead())
                                .collect(Collectors.toList());

                for (Message message : unreadMessages) {
                        message.setRead(true);
                        message.setReadAt(LocalDateTime.now());
                }

                messageRepository.saveAll(unreadMessages);
        }

        public ChatResponse getChatRoom(Long chatRoomId, Long userId) {
                ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                                .orElseThrow(() -> new RuntimeException("Chat room not found"));

                // Verify user is participant
                boolean isParticipant = chatRoom.getParticipants().stream()
                                .anyMatch(user -> user.getId().equals(userId));

                if (!isParticipant) {
                        throw new RuntimeException("User is not a participant in this chat");
                }

                return convertToChatResponse(chatRoom);
        }

        @Transactional
        public ChatRoom createGroupChat(String name, List<Long> participantIds, Long creatorId) {
                User creator = userRepository.findById(creatorId)
                                .orElseThrow(() -> new RuntimeException("Creator not found"));

                List<User> participants = userRepository.findAllById(participantIds);
                participants.add(creator);

                ChatRoom chatRoom = ChatRoom.builder()
                                .name(name)
                                .isGroup(true)
                                .participants(participants)
                                .lastMessage("Group created")
                                .lastMessageAt(LocalDateTime.now())
                                .build();

                return chatRoomRepository.save(chatRoom);
        }

        private ChatRoom findOrCreatePrivateChatRoom(User user1, User user2) {
                return chatRoomRepository.findPrivateChatRoom(user1.getId(), user2.getId())
                                .orElseGet(() -> {
                                        ChatRoom chatRoom = ChatRoom.builder()
                                                        .name(user1.getUsername() + " & " + user2.getUsername())
                                                        .isGroup(false)
                                                        .participants(List.of(user1, user2))
                                                        .lastMessageAt(LocalDateTime.now())
                                                        .build();

                                        return chatRoomRepository.save(chatRoom);
                                });
        }

        private ChatResponse convertToChatResponse(ChatRoom chatRoom) {
                List<MessageResponse> messages = messageRepository.findByChatRoomId(chatRoom.getId()).stream()
                                .map(this::convertToMessageResponse)
                                .limit(50) // Limit to last 50 messages
                                .collect(Collectors.toList());

                int unreadCount = (int) messages.stream()
                                .filter(message -> !message.isRead())
                                .count();

                List<UserResponse> participants = chatRoom.getParticipants().stream()
                                .map(user -> convertToUserResponse(user))
                                .collect(Collectors.toList());

                return ChatResponse.builder()
                                .id(chatRoom.getId())
                                .name(chatRoom.getName())
                                .isGroup(chatRoom.isGroup())
                                .lastMessage(chatRoom.getLastMessage())
                                .lastMessageAt(chatRoom.getLastMessageAt())
                                .createdAt(chatRoom.getCreatedAt())
                                .messages(messages)
                                .participants(participants)
                                .unreadCount(unreadCount)
                                .build();
        }

        private MessageResponse convertToMessageResponse(Message message) {
                return MessageResponse.builder()
                                .id(message.getId())
                                .senderId(message.getSender().getId())
                                .senderName(message.getSender().getUsername())
                                .senderAvatar(message.getSender().getAvatarUrl())
                                .content(message.getContent())
                                .messageType(message.getMessageType())
                                .isRead(message.isRead())
                                .readAt(message.getReadAt())
                                .createdAt(message.getCreatedAt())
                                .build();
        }

        private UserResponse convertToUserResponse(User user) {
                var settings = settingsRepository.findByUserId(user.getId())
                                .orElse(com.chatapp.entity.UserSettings.builder()
                                                .showLastSeen(true)
                                                .showProfilePhoto(true)
                                                .showStatus(true)
                                                .profileVisibility("EVERYONE")
                                                .build());

                return UserResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .avatarUrl(user.getAvatarUrl())
                                .bio(user.getBio())
                                .status(user.getStatus())
                                .online(user.isOnline())
                                .lastSeen(user.getLastSeen())
                                .createdAt(user.getCreatedAt())
                                .showLastSeen(settings.isShowLastSeen())
                                .showProfilePhoto(settings.isShowProfilePhoto())
                                .showStatus(settings.isShowStatus())
                                .profileVisibility(settings.getProfileVisibility())
                                .build();
        }
}