package com.chatapp.chatapp_backend.repository;

import com.chatapp.chatapp_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Método para buscar usuario por su nombre de usuario
    Optional<User> findByUsername(String username);

    // Método para buscar usuario por email (útil para el login)
    Optional<User> findByEmail(String email);

    // Verificar si existe el email
    Boolean existsByEmail(String email);

    // Traer todos los usuarios (para la lista de contactos)
    List<User> findAll();
}