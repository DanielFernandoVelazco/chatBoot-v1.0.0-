package com.chatapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupChatRequest {
    private String name;
    private String description;
    private List<String> participantIds;
}