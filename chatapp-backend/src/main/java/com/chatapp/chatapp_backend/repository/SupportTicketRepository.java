package com.chatapp.chatapp_backend.repository;

import com.chatapp.chatapp_backend.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    // Buscar tickets por email
    List<SupportTicket> findByEmail(String email);

    // Buscar tickets por usuario
    List<SupportTicket> findByUserId(Long userId);

    // Buscar tickets por estado
    List<SupportTicket> findByStatus(SupportTicket.TicketStatus status);

    // Contar tickets pendientes
    Long countByStatus(SupportTicket.TicketStatus status);
}