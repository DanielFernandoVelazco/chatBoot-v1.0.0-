package com.chatapp.chatapp_backend.controller;

import com.chatapp.chatapp_backend.dto.ContactRequestDto;
import com.chatapp.chatapp_backend.dto.ContactResponseDto;
import com.chatapp.chatapp_backend.dto.FaqItemDto;
import com.chatapp.chatapp_backend.dto.TermsContentDto;
import com.chatapp.chatapp_backend.service.SupportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://localhost:5173")
public class SupportController {

    @Autowired
    private SupportService supportService;

    @PostMapping("/contact")
    public ResponseEntity<ContactResponseDto> createSupportTicket(@Valid @RequestBody ContactRequestDto contactRequest) {
        try {
            ContactResponseDto response = supportService.createSupportTicket(contactRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/faq")
    public ResponseEntity<List<FaqItemDto>> getFaq() {
        try {
            List<FaqItemDto> faqItems = supportService.getFaqItems();
            return ResponseEntity.ok(faqItems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/terms")
    public ResponseEntity<TermsContentDto> getTermsAndConditions() {
        try {
            TermsContentDto terms = supportService.getTermsAndConditions();
            return ResponseEntity.ok(terms);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/privacy")
    public ResponseEntity<TermsContentDto> getPrivacyPolicy() {
        try {
            TermsContentDto privacyPolicy = supportService.getPrivacyPolicy();
            return ResponseEntity.ok(privacyPolicy);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}