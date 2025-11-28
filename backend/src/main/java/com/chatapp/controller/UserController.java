package com.chatapp.controller;

import com.chatapp.model.User;
import com.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/online")
    public ResponseEntity<List<User>> getOnlineUsers() {
        List<User> users = userService.getOnlineUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser) {
        User user = userService.updateProfile(updatedUser);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/status/{status}")
    public ResponseEntity<User> updateStatus(@PathVariable String status) {
        User user = userService.updateStatus(status);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/contacts/{userId}")
    public ResponseEntity<Void> addContact(@PathVariable String userId) {
        userService.addContact(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/contacts/{userId}")
    public ResponseEntity<Void> removeContact(@PathVariable String userId) {
        userService.removeContact(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<User>> getUserContacts() {
        List<User> contacts = userService.getUserContacts();
        return ResponseEntity.ok(contacts);
    }

    @PutMapping("/privacy")
    public ResponseEntity<Void> updatePrivacySettings(@RequestBody User.PrivacySettings privacySettings) {
        userService.updatePrivacySettings(privacySettings);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notifications")
    public ResponseEntity<Void> updateNotificationSettings(
            @RequestBody User.NotificationSettings notificationSettings) {
        userService.updateNotificationSettings(notificationSettings);
        return ResponseEntity.ok().build();
    }
}