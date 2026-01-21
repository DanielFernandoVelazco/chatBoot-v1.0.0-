package com.chatapp.repository;

import com.chatapp.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

        @Query("SELECT m FROM Message m " +
                        "WHERE m.chatRoom.id = :chatRoomId " +
                        "ORDER BY m.createdAt ASC")
        List<Message> findByChatRoomId(@Param("chatRoomId") Long chatRoomId);

        @Query("SELECT m FROM Message m " +
                        "WHERE (m.sender.id = :user1Id AND m.receiver.id = :user2Id) " +
                        "OR (m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
                        "ORDER BY m.createdAt ASC")
        List<Message> findMessagesBetweenUsers(@Param("user1Id") Long user1Id,
                        @Param("user2Id") Long user2Id);

        @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND m.isRead = false")
        List<Message> findUnreadMessages(@Param("userId") Long userId);

        @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId " +
                        "ORDER BY m.createdAt DESC LIMIT 1")
        Message findLastMessageByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}