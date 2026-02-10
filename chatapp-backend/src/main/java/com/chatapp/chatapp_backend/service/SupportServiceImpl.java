package com.chatapp.chatapp_backend.service;

import com.chatapp.chatapp_backend.dto.ContactRequestDto;
import com.chatapp.chatapp_backend.dto.ContactResponseDto;
import com.chatapp.chatapp_backend.dto.FaqItemDto;
import com.chatapp.chatapp_backend.dto.TermsContentDto;
import com.chatapp.chatapp_backend.model.SupportTicket;
import com.chatapp.chatapp_backend.model.User;
import com.chatapp.chatapp_backend.repository.SupportTicketRepository;
import com.chatapp.chatapp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class SupportServiceImpl implements SupportService {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ContactResponseDto createSupportTicket(ContactRequestDto contactRequest) {
        SupportTicket ticket = new SupportTicket();

        // Asignar usuario si está autenticado
        if (contactRequest.getUserId() != null) {
            Optional<User> userOptional = userRepository.findById(contactRequest.getUserId());
            userOptional.ifPresent(ticket::setUser);
        }

        // Asignar datos del formulario
        ticket.setName(contactRequest.getName());
        ticket.setEmail(contactRequest.getEmail());
        ticket.setSubject(contactRequest.getSubject());
        ticket.setMessage(contactRequest.getMessage());
        ticket.setStatus(SupportTicket.TicketStatus.PENDING);
        ticket.setCreatedAt(LocalDateTime.now());

        SupportTicket savedTicket = supportTicketRepository.save(ticket);

        return mapToContactResponseDto(savedTicket);
    }

    @Override
    public List<FaqItemDto> getFaqItems() {
        // Datos estáticos por ahora, podrían venir de base de datos
        return Arrays.asList(
                new FaqItemDto(1L,
                        "¿Cómo registro mi cuenta?",
                        "Haz clic en 'Regístrate' en la pantalla de inicio, completa el formulario con tu nombre, email y contraseña. Recibirás un correo de confirmación.",
                        "Cuenta"),
                new FaqItemDto(2L,
                        "¿Cómo cambio mi contraseña?",
                        "Ve a 'Editar Perfil' → 'Ajustes de Cuenta' → 'Cambiar Contraseña'. Introduce tu contraseña actual y la nueva.",
                        "Seguridad"),
                new FaqItemDto(3L,
                        "¿Puedo desactivar las notificaciones?",
                        "Sí, ve a 'Configuración de Notificaciones' desde el menú de perfil. Allí podrás personalizar qué notificaciones recibir.",
                        "Notificaciones"),
                new FaqItemDto(4L,
                        "¿Cómo funciona el chat con IA?",
                        "Activa el modo IA con el botón 🤖. Escribe tus preguntas y la IA generará respuestas automáticamente.",
                        "Funcionalidad"),
                new FaqItemDto(5L,
                        "¿Puedo subir imágenes en el chat?",
                        "Sí, haz clic en el botón ➕ junto al campo de texto y selecciona una imagen desde tu dispositivo.",
                        "Chat"),
                new FaqItemDto(6L,
                        "¿Cómo elimino mi cuenta?",
                        "Actualmente, contacta con soporte para solicitar la eliminación de tu cuenta. Estamos trabajando en una opción de auto-eliminación.",
                        "Cuenta"),
                new FaqItemDto(7L,
                        "¿Los mensajes son privados?",
                        "Sí, todas las conversaciones están encriptadas y solo son visibles para los participantes.",
                        "Privacidad"),
                new FaqItemDto(8L,
                        "¿Hay límite de mensajes?",
                        "No hay límite en la cantidad de mensajes que puedes enviar.",
                        "Chat")
        );
    }

    @Override
    public TermsContentDto getTermsAndConditions() {
        return new TermsContentDto(
                "Términos y Condiciones de ChatApp",
                LocalDateTime.now().minusDays(15).toString(),
                "<h2>1. Aceptación de los Términos</h2>" +
                        "<p>Al acceder y usar ChatApp, aceptas cumplir con estos Términos y Condiciones.</p>" +
                        "<h2>2. Uso del Servicio</h2>" +
                        "<p>Debes tener al menos 13 años para usar nuestro servicio. Eres responsable de mantener la confidencialidad de tu cuenta.</p>" +
                        "<h2>3. Contenido del Usuario</h2>" +
                        "<p>Eres responsable del contenido que publiques. No permitimos contenido ilegal, ofensivo o que infrinja derechos de terceros.</p>" +
                        "<h2>4. Propiedad Intelectual</h2>" +
                        "<p>ChatApp y su contenido están protegidos por derechos de autor y otras leyes de propiedad intelectual.</p>" +
                        "<h2>5. Limitación de Responsabilidad</h2>" +
                        "<p>ChatApp no se hace responsable por daños indirectos, incidentales o consecuentes.</p>" +
                        "<h2>6. Modificaciones</h2>" +
                        "<p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>",
                "2.1.0"
        );
    }

    @Override
    public TermsContentDto getPrivacyPolicy() {
        return new TermsContentDto(
                "Política de Privacidad de ChatApp",
                LocalDateTime.now().minusDays(30).toString(),
                "<h2>1. Información que Recopilamos</h2>" +
                        "<p>Recopilamos información que nos proporcionas al registrarte, como nombre, email y datos de perfil.</p>" +
                        "<h2>2. Uso de la Información</h2>" +
                        "<p>Usamos tu información para proporcionar el servicio, mejorar la experiencia y comunicarnos contigo.</p>" +
                        "<h2>3. Protección de Datos</h2>" +
                        "<p>Implementamos medidas de seguridad para proteger tu información personal.</p>" +
                        "<h2>4. Compartir Información</h2>" +
                        "<p>No vendemos tu información personal a terceros. Solo compartimos datos cuando es necesario para operar el servicio.</p>" +
                        "<h2>5. Tus Derechos</h2>" +
                        "<p>Tienes derecho a acceder, corregir o eliminar tu información personal.</p>" +
                        "<h2>6. Cookies</h2>" +
                        "<p>Usamos cookies para mejorar la funcionalidad del sitio. Puedes controlar las cookies desde tu navegador.</p>" +
                        "<h2>7. Cambios en la Política</h2>" +
                        "<p>Notificaremos cambios importantes en esta política de privacidad.</p>",
                "1.3.0"
        );
    }

    private ContactResponseDto mapToContactResponseDto(SupportTicket ticket) {
        ContactResponseDto dto = new ContactResponseDto();
        dto.setId(ticket.getId());
        dto.setName(ticket.getName());
        dto.setEmail(ticket.getEmail());
        dto.setSubject(ticket.getSubject());
        dto.setStatus(ticket.getStatus().toString());
        dto.setCreatedAt(ticket.getCreatedAt());

        // Crear preview del mensaje (primeros 100 caracteres)
        String message = ticket.getMessage();
        String preview = message.length() > 100 ? message.substring(0, 100) + "..." : message;
        dto.setMessagePreview(preview);

        return dto;
    }
}