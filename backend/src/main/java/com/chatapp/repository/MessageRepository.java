package com.chatapp.repository;

import com.chatapp.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    // Encontrar mensajes de un chat con paginación
    Page<Message> findByChatIdOrderByTimestampDesc(String chatId, Pageable pageable);

    // Encontrar mensajes de un chat entre fechas
    List<Message> findByChatIdAndTimestampBetweenOrderByTimestampAsc(
            String chatId, LocalDateTime start, LocalDateTime end);

    // Encontrar mensajes no leídos de un usuario en un chat
    @Query("{ 'chatId': ?0, 'deliveryStatus.readBy': { $ne: ?1 } }")
    List<Message> findUnreadMessagesByChatAndUser(String chatId, String userId);

    // Encontrar mensajes por tipo
    List<Message> findByChatIdAndType(String chatId, Message.MessageType type);

    // Encontrar mensajes que contengan texto específico
    @Query("{ 'chatId': ?0, 'content': { $regex: ?1, $options: 'i' } }")
    List<Message> findByChatIdAndContentContainingIgnoreCase(String chatId, String content);

    // Contar mensajes no leídos por chat y usuario
    @Query(value = "{ 'chatId': ?0, 'deliveryStatus.readBy': { $ne: ?1 } }", count = true)
    Long countUnreadMessagesByChatAndUser(String chatId, String userId);

    // Encontrar el último mensaje de un chat
    Optional<Message> findFirstByChatIdOrderByTimestampDesc(String chatId);

    // Encontrar mensajes con archivos
    @Query("{ 'chatId': ?0, 'fileMetadata': { $exists: true, $ne: null } }")
    List<Message> findMessagesWithFilesByChatId(String chatId);

    // Encontrar mensajes editados
    @Query("{ 'chatId': ?0, 'editInfo': { $exists: true, $ne: null } }")
    List<Message> findEditedMessagesByChatId(String chatId);

    // Eliminar mensajes antiguos (para limpieza)
    void deleteByTimestampBefore(LocalDateTime date);
}