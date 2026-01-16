package com.chatapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private Long chatRoomId;

    @NotBlank(message = "Content is required")
    private String content;

    private String messageType = "TEXT"; // TEXT, IMAGE, FILE, AUDIO
}