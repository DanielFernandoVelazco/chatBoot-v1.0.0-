package com.chatapp.dto;

import com.chatapp.model.Message;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String content;
    private Message.MessageType type = Message.MessageType.TEXT;
}