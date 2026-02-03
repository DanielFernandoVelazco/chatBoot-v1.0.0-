package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.MessageRequestDto;
import com.chatapp.chatapp_backend.dto.MessageResponseDto;
import com.chatapp.chatapp_backend.model.Message;
import com.chatapp.chatapp_backend.model.User;
import com.chatapp.chatapp_backend.repository.MessageRepository;
import com.chatapp.chatapp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public MessageResponseDto sendMessage(MessageRequestDto requestDto) {
        // 1. Buscar usuarios
        User sender = userRepository.findById(requestDto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Emisor no encontrado"));
        User receiver = userRepository.findById(requestDto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receptor no encontrado"));

        // 2. Crear mensaje
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(requestDto.getContent());

        // 3. Guardar en DB
        Message savedMessage = messageRepository.save(message);

        // 4. Convertir a DTO
        MessageResponseDto responseDto = mapToResponseDto(savedMessage);

        // 5. ENVIAR POR WEBSOCKET (NUEVA LÓGICA)
        // En lugar de enviar a un usuario específico, enviamos a un Topic global.
        // Todos los clientes conectados lo recibirán.
        messagingTemplate.convertAndSend("/topic/messages", responseDto);

        // 6. Retornar respuesta HTTP
        return responseDto;
    }

    @Override
    public List<MessageResponseDto> getConversation(Long userId1, Long userId2) {
        List<Message> messages = messageRepository.findConversation(userId1, userId2);
        return messages.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    private MessageResponseDto mapToResponseDto(Message message) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getUsername()); // AGREGAR ESTA LÍNEA
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        return dto;
    }
}