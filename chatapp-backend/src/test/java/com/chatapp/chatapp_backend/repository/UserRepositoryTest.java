package com.chatapp.chatapp_backend.repository;

// ... resto del código
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import com.chatapp.chatapp_backend.model.User;

@DataJpaTest
// IMPORTANTE: Esto usa la configuración de application.yaml (Postgres) en lugar
// de una BD falsa
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        // Preparamos un usuario antes de cada test
        user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setOnline(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testSaveAndFindUser() {
        // 1. Guardar
        User savedUser = userRepository.save(user);

        // 2. Verificar que se guardó y se asignó ID
        assertNotNull(savedUser);
        assertNotNull(savedUser.getId());

        // 3. Buscar por Email
        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        // 4. Verificar que lo encontró
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
    }
}