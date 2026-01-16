package com.chatapp.repository;

import com.chatapp.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT cr FROM ChatRoom cr " +
            "JOIN cr.participants p " +
            "WHERE cr.isGroup = false AND p.id IN (:user1Id, :user2Id) " +
            "GROUP BY cr.id " +
            "HAVING COUNT(DISTINCT p.id) = 2")
    Optional<ChatRoom> findPrivateChatRoom(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("SELECT cr FROM ChatRoom cr " +
            "JOIN cr.participants p " +
            "WHERE p.id = :userId " +
            "ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);

    List<ChatRoom> findByIsGroupTrue();
}