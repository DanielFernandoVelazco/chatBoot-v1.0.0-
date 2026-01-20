package com.chatapp.config;

import com.chatapp.entity.ChatRoom;
import com.chatapp.entity.User;
import com.chatapp.entity.UserSettings;
import com.chatapp.repository.ChatRoomRepository;
import com.chatapp.repository.UserRepository;
import com.chatapp.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final UserSettingsRepository settingsRepository;
        private final ChatRoomRepository chatRoomRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                log.info("Initializing application data...");

                // Check if users already exist
                if (userRepository.count() == 0) {
                        createInitialUsers();
                }

                log.info("Data initialization completed.");
        }

        private void createInitialUsers() {
                // URLs de avatar más cortas
                List<User> users = Arrays.asList(
                                createUser("john_doe", "john.doe@email.com", "John Doe",
                                                "https://ui-avatars.com/api/?name=John+Doe&background=2b6cee&color=fff",
                                                "Hey there! I'm using ChatApp", true),

                                createUser("elena_rodriguez", "elena.rodriguez@email.com", "Elena Rodriguez",
                                                "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=2b6cee&color=fff",
                                                "Perfect! See you then.", true),

                                createUser("marcus_chen", "marcus.chen@email.com", "Marcus Chen",
                                                "https://ui-avatars.com/api/?name=Marcus+Chen&background=2b6cee&color=fff",
                                                "Can you send over the file?", true),

                                createUser("aisha_khan", "aisha.khan@email.com", "Aisha Khan",
                                                "https://ui-avatars.com/api/?name=Aisha+Khan&background=2b6cee&color=fff",
                                                "Sounds good, I'll review it today.", false),

                                createUser("alejandro_vargas", "alejandro.vargas@email.com", "Alejandro Vargas",
                                                "https://ui-avatars.com/api/?name=Alejandro+Vargas&background=2b6cee&color=fff",
                                                "Desarrollador de software y entusiasta de la tecnología", true));

                // Save users and create settings
                for (User user : users) {
                        userRepository.save(user);

                        UserSettings settings = UserSettings.builder()
                                        .user(user)
                                        .showLastSeen(true)
                                        .showProfilePhoto(true)
                                        .showStatus(true)
                                        .profileVisibility("EVERYONE")
                                        .desktopNotifications(true)
                                        .soundNotifications(true)
                                        .doNotDisturb(false)
                                        .notificationTone("DEFAULT")
                                        .notificationType("ALL")
                                        .twoFactorEnabled(false)
                                        .theme("SYSTEM")
                                        .build();

                        settingsRepository.save(settings);
                        user.setSettings(settings);
                }

                // Create some chat rooms
                createChatRooms();
        }

        private User createUser(String username, String email, String fullName,
                        String avatarUrl, String status, boolean online) {
                return User.builder()
                                .username(username)
                                .email(email)
                                .fullName(fullName)
                                .password(passwordEncoder.encode("password123"))
                                .avatarUrl(avatarUrl)
                                .status(status)
                                .online(online)
                                .lastSeen(LocalDateTime.now())
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();
        }

        private void createChatRooms() {
                List<User> users = userRepository.findAll();

                if (users.size() >= 2) {
                        User john = users.get(0);
                        User elena = users.get(1);
                        User marcus = users.get(2);

                        // Create private chat room between John and Elena
                        ChatRoom privateChat = ChatRoom.builder()
                                        .name(john.getUsername() + " & " + elena.getUsername())
                                        .isGroup(false)
                                        .participants(Arrays.asList(john, elena))
                                        .lastMessage("Perfect! See you then.")
                                        .lastMessageAt(LocalDateTime.now().minusHours(2))
                                        .createdAt(LocalDateTime.now().minusDays(1))
                                        .build();

                        chatRoomRepository.save(privateChat);

                        // Create group chat
                        ChatRoom groupChat = ChatRoom.builder()
                                        .name("Project Team")
                                        .isGroup(true)
                                        .participants(Arrays.asList(john, elena, marcus))
                                        .lastMessage("Can you send over the file?")
                                        .lastMessageAt(LocalDateTime.now().minusHours(1))
                                        .createdAt(LocalDateTime.now().minusDays(2))
                                        .build();

                        chatRoomRepository.save(groupChat);
                }
        }
}