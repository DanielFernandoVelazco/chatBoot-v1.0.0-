package com.chatapp.chatapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TermsContentDto {
    private String title;
    private String lastUpdated;
    private String content; // HTML o markdown
    private String version;
}