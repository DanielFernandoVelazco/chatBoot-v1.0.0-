package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.MessageRequestDto;
import com.chatapp.chatapp_backend.dto.MessageResponseDto;

import java.util.List;

public interface MessageService {
    MessageResponseDto sendMessage(MessageRequestDto requestDto);
    List<MessageResponseDto> getConversation(Long userId1, Long userId2);
}