package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaqItemDto {
    private Long id;
    private String question;
    private String answer;
    private String category;
}