package com.chatapp.config;

import com.chatapp.model.User;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Solo crear usuarios de prueba si no existen
        if (userRepository.count() == 0) {
            log.info("Creando usuarios de prueba...");

            User user1 = User.builder()
                    .username("alexdoe")
                    .email("alex@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .fullName("Alex Doe")
                    .bio("Desarrollador de software")
                    .profilePicture(
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face")
                    .status("ONLINE")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .privacySettings(User.PrivacySettings.builder()
                            .lastSeenVisibility("EVERYONE")
                            .profilePictureVisibility("EVERYONE")
                            .infoVisibility("EVERYONE")
                            .readReceipts(true)
                            .build())
                    .notificationSettings(User.NotificationSettings.builder()
                            .desktopNotifications(true)
                            .soundEnabled(true)
                            .notificationTone("default")
                            .messageNotificationType("ALL")
                            .doNotDisturb(false)
                            .build())
                    .contacts(Arrays.asList())
                    .build();

            User user2 = User.builder()
                    .username("elenarod")
                    .email("elena@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .fullName("Elena Rodriguez")
                    .bio("Diseñadora UX/UI")
                    .profilePicture(
                            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face")
                    .status("ONLINE")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .privacySettings(User.PrivacySettings.builder()
                            .lastSeenVisibility("CONTACTS")
                            .profilePictureVisibility("EVERYONE")
                            .infoVisibility("CONTACTS")
                            .readReceipts(true)
                            .build())
                    .notificationSettings(User.NotificationSettings.builder()
                            .desktopNotifications(true)
                            .soundEnabled(false)
                            .notificationTone("chime")
                            .messageNotificationType("MENTIONS")
                            .doNotDisturb(false)
                            .build())
                    .contacts(Arrays.asList())
                    .build();

            userRepository.saveAll(Arrays.asList(user1, user2));
            log.info("Usuarios de prueba creados exitosamente");
        }
    }
}