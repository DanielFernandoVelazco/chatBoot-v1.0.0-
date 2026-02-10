package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.ContactRequestDto;
import com.chatapp.chatapp_backend.dto.ContactResponseDto;
import com.chatapp.chatapp_backend.dto.FaqItemDto;
import com.chatapp.chatapp_backend.dto.TermsContentDto;

import java.util.List;

public interface SupportService {

    // Crear un nuevo ticket de soporte
    ContactResponseDto createSupportTicket(ContactRequestDto contactRequest);

    // Obtener preguntas frecuentes
    List<FaqItemDto> getFaqItems();

    // Obtener términos y condiciones
    TermsContentDto getTermsAndConditions();

    // Obtener política de privacidad
    TermsContentDto getPrivacyPolicy();
}