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
        // Create test users
        List<User> users = Arrays.asList(
                createUser("john_doe", "john.doe@email.com", "John Doe",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCRL75jfZQM4eOBM_ZllavNJYEQHcUeW5W-6oZ2HCAJcsm4GBd-doJhxFINjkmjmuq9Uwe6tTkPn-p5hRbHeGb-hDUwdjCf73sJP_axsMikpdjLJEp2brhe1MKWtVtcmrYa0dYAa0D2CcgIbZegDKZRwdrTYjzbYFp3bHKFwnmJxk6mF28UyiLDcd59vTNv1mS9PijOnfJgBQH63Di4TSgPR07GqzhQLrkY-XK5QlzYZdWPa1EVDi9689G8PRBl8TeOPbS3Ic092_Z_",
                        "Hey there! I'm using ChatApp", true),

                createUser("elena_rodriguez", "elena.rodriguez@email.com", "Elena Rodriguez",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8lxCt-RLBHUHS-6Mp9_gm7sov0us27_XTrs4dKKwGH0wiVd8QSahl3mG0_w8IkL--L-AqYoLEll2LALK1C3jzM8knl_v_bJ_kXa-UEXK9cnMbfVLziNj33YE0_oLJFJYoh-dTc6iZc5A8fAMtPBQuWMtEkg2ovhgt529IOiFDI-AaJGZEblh0Bc2aAv9xHM2xUzAcHea_C8gUk7PivFVl9KyPgFGBz2iCDiXa-Kkp72OSUpGrO73jRvXC_OZoJIU--jXN6pgAesgk",
                        "Perfect! See you then.", true),

                createUser("marcus_chen", "marcus.chen@email.com", "Marcus Chen",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuB90P6TCrUZyofI6JSchBBfpaElY4Ahtdft9coGRVOCnS5lUND8isJtnzeCHrV3URw7q7BjDGjwknlzbbdH4Wa1H5yEMJmEV9od4daa23TpJmK6r4Qw_WQHWAxJP_RAlkn3j753uvgdfFWBcqozdz2ZKOa6JaAQsO4Qjk96NX0LEZvAxmQXygGN0qIuaTrQ4OjWcWhy506Mnh-T7J1MfGudj57ewsPgFiMSN6mTyQgbEGYu3CjR6P6zFDNdEtXHf6MPj218eML251qx",
                        "Can you send over the file?", true),

                createUser("aisha_khan", "aisha.khan@email.com", "Aisha Khan",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDFLltKVOGYbvp7-g7Q8yyzAx7YJlm6p0rFgWq1R8FLUKFJEObwjJVnXmhpsRI97-OlgDxpSSblNAEWAqoTAXRvM9OmCpeG6Aa0Cisau4d4HyTn3iaBwuFNzF-GUmkVuEI9x4J8tPMSzh8ec8I9r4FqwN4verMM3AeIuYbmvBZ8WMumv_R220y8HvuDh8mA-dBbdb9teakcU0-qO0JYO9a7JUc5-x4oFObQjCN3F7INEzArGzlSXo5bCERBNsygxuwHQ5T1SnLSM9VF",
                        "Sounds good, I'll review it today.", false),

                createUser("alejandro_vargas", "alejandro.vargas@email.com", "Alejandro Vargas",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDVEU05hcKahoX66vxt-JTz1hcdhbKQXvn2Z3YnlPeG-TPk37VfUynIJ_gG9mrk0pjMMmbYDt9IMuMBMIfylsuLd1G9ULkVBdHb-n8Rkwa6QIued2iNF15roSasII-1hYPTBN56wBfMMGc3z8mTkcJelao80rLDlt0wx_e5YEDJjg40ou_n6KLvWnGt8I2HnDigquNqsITz3eYMjGdPZvaiAJ9yCMYmf3C_YFFwSOGFzkcdxJqxtS0FHO5f_UzxCuhVkjn3dISAG2bh",
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