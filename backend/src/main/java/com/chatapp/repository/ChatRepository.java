package com.chatapp.repository;

import com.chatapp.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {

    // Encontrar chats donde el usuario es participante
    @Query("{ 'participantIds': ?0 }")
    List<Chat> findByParticipantId(String userId);

    // Encontrar chat privado entre dos usuarios
    @Query("{ 'type': 'PRIVATE', 'participantIds': { $all: [?0, ?1] } }")
    Optional<Chat> findPrivateChatBetweenUsers(String user1Id, String user2Id);

    // Encontrar chats grupales
    List<Chat> findByType(Chat.ChatType type);

    // Encontrar chats por nombre (para grupos)
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Chat> findByNameContainingIgnoreCase(String name);

    // Encontrar chats archivados de un usuario
    @Query("{ 'participantIds': ?0, 'settings.isArchived': true }")
    List<Chat> findArchivedChatsByUserId(String userId);

    // Encontrar chats fijados de un usuario
    @Query("{ 'participantIds': ?0, 'settings.isPinned': true }")
    List<Chat> findPinnedChatsByUserId(String userId);

    // Verificar si existe un chat entre usuarios
    @Query("{ 'participantIds': { $all: ?0 } }")
    Boolean existsChatWithParticipants(List<String> participantIds);
}