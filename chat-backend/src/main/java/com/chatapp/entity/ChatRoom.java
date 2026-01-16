package com.chatapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private boolean isGroup;

    @ManyToMany(mappedBy = "chatRooms")
    private List<User> participants;

    @OneToMany(mappedBy = "chatRoom")
    private List<Message> messages;

    private String lastMessage;

    private LocalDateTime lastMessageAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastMessageAt = LocalDateTime.now();
    }
}