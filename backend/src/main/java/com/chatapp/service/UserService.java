package com.chatapp.service;

import com.chatapp.model.User;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
//import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WebSocketNotificationService webSocketNotificationService;

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }

    public List<User> getOnlineUsers() {
        return userRepository.findByStatus("ONLINE");
    }

    public User updateProfile(User updatedUser) {
        User currentUser = getCurrentUser();

        currentUser.setFullName(updatedUser.getFullName());
        currentUser.setBio(updatedUser.getBio());
        currentUser.setProfilePicture(updatedUser.getProfilePicture());
        currentUser.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(currentUser);
    }

    public void addContact(String contactUserId) {
        User currentUser = getCurrentUser();
        // User contactUser = getUserById(contactUserId);

        if (!currentUser.getContacts().contains(contactUserId)) {
            currentUser.getContacts().add(contactUserId);
            userRepository.save(currentUser);
        }
    }

    public void removeContact(String contactUserId) {
        User currentUser = getCurrentUser();
        currentUser.getContacts().remove(contactUserId);
        userRepository.save(currentUser);
    }

    public List<User> getUserContacts() {
        User currentUser = getCurrentUser();
        return userRepository.findAllById(currentUser.getContacts());
    }

    public void updatePrivacySettings(User.PrivacySettings privacySettings) {
        User user = getCurrentUser();
        user.setPrivacySettings(privacySettings);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void updateNotificationSettings(User.NotificationSettings notificationSettings) {
        User user = getCurrentUser();
        user.setNotificationSettings(notificationSettings);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public User updateStatus(String status) {
        User user = getCurrentUser();
        user.setStatus(status);
        user.setLastSeen(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        // Notificar cambio de estado via WebSocket
        webSocketNotificationService.notifyUserStatusChange(savedUser.getId(), status);
        return savedUser;
    }
}