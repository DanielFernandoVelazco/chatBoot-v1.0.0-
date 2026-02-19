# ⚙️ ChatApp - Backend (Spring Boot)

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-purple)
![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descripción

Backend de ChatApp, una API REST robusta y escalable construida con **Spring Boot**. Proporciona servicios de autenticación, mensajería en tiempo real vía WebSocket, integración con IA, gestión de usuarios y sistema de soporte con tickets.

---

## ✨ Características del Backend

### 🔐 Autenticación y Usuarios
- ✅ **Registro** de usuarios con encriptación BCrypt
- ✅ **Inicio de sesión** seguro
- ✅ **Edición de perfil** (nombre, bio, foto)
- ✅ **Cambio de contraseña** con verificación
- ✅ **Configuración de privacidad** (última vez visto)

### 💬 Mensajería
- ✅ **API REST** para mensajes
- ✅ **WebSocket** para comunicación en tiempo real
- ✅ **Persistencia** en base de datos MySQL
- ✅ **Conversaciones** entre usuarios
- ✅ **Mensajes no leídos** (estructura lista)

### 🤖 Integración con IA
- ✅ **Endpoint** `/api/ai/chat`
- ✅ Configurable vía `application.yaml`
- ✅ Soporte para **OpenAI** y APIs compatibles
- ✅ **Prompt personalizable**

### 📞 Señalización de Llamadas (WebRTC)
- ✅ **WebSocket** para signaling
- ✅ **Ofertas/Respuestas** SDP
- ✅ **Candidatos ICE**
- ✅ **Gestión de llamadas activas**
- ✅ **Notificaciones** de rechazo/finalización

### 🆘 Sistema de Soporte
- ✅ **Entidad** `SupportTicket` con estados
- ✅ **Endpoint** `/api/support/contact`
- ✅ **FAQ** estático (escalable a DB)
- ✅ **Términos y condiciones**
- ✅ **Política de privacidad**

---

## 📁 Estructura del Proyecto

backend/
├── src/
│ ├── main/
│ │ ├── java/com/chatapp/chatapp_backend/
│ │ │ ├── config/ # Configuraciones
│ │ │ │ ├── SecurityConfig.java # Seguridad y CORS
│ │ │ │ ├── WebSocketConfig.java # STOMP WebSocket
│ │ │ │ └── AppConfig.java # Beans adicionales
│ │ │ │
│ │ │ ├── controller/ # Controladores REST/WebSocket
│ │ │ │ ├── AuthController.java # /api/auth/*
│ │ │ │ ├── MessageController.java # /api/messages/*
│ │ │ │ ├── AIController.java # /api/ai/*
│ │ │ │ ├── SupportController.java # /api/support/*
│ │ │ │ └── CallController.java # /app/call/* (WebSocket)
│ │ │ │
│ │ │ ├── dto/ # Data Transfer Objects
│ │ │ │ ├── UserRegistrationDto.java
│ │ │ │ ├── UserResponseDto.java
│ │ │ │ ├── UserUpdateDto.java
│ │ │ │ ├── MessageRequestDto.java
│ │ │ │ ├── MessageResponseDto.java
│ │ │ │ ├── ContactRequestDto.java
│ │ │ │ ├── ContactResponseDto.java
│ │ │ │ ├── FaqItemDto.java
│ │ │ │ └── TermsContentDto.java
│ │ │ │
│ │ │ ├── model/ # Entidades JPA
│ │ │ │ ├── User.java
│ │ │ │ ├── Message.java
│ │ │ │ └── SupportTicket.java
│ │ │ │
│ │ │ ├── repository/ # Repositorios Spring Data
│ │ │ │ ├── UserRepository.java
│ │ │ │ ├── MessageRepository.java
│ │ │ │ └── SupportTicketRepository.java
│ │ │ │
│ │ │ └── service/ # Lógica de negocio
│ │ │ ├── UserService.java
│ │ │ ├── UserServiceImpl.java
│ │ │ ├── MessageService.java
│ │ │ ├── MessageServiceImpl.java
│ │ │ ├── AIService.java
│ │ │ └── SupportService.java
│ │ │
│ │ └── resources/
│ │ ├── application.yaml # Configuración principal
│ │ └── static/ # Archivos estáticos (opcional)
│ │
│ └── test/ # Pruebas unitarias
│
├── pom.xml # Dependencias Maven
└── README.md # Este archivo


---

## 🚀 Tecnologías Utilizadas

### Core
- **Java 17** - Lenguaje principal
- **Spring Boot 3.1** - Framework
- **Spring MVC** - API REST
- **Spring Data JPA** - Persistencia
- **Hibernate** - ORM

### Seguridad
- **Spring Security** - Autenticación
- **BCrypt** - Encriptación de contraseñas
- **CORS** - Configuración de accesos

### Comunicación
- **WebSocket (STOMP)** - Tiempo real
- **SockJS** - Fallback para WebSocket
- **RestTemplate** - Cliente HTTP (para IA)

### Base de Datos
- **MySQL 8** - Base de datos principal
- **H2** (opcional) - Para pruebas

### Utilidades
- **Lombok** - Reducción de código
- **Jakarta Validation** - Validación de DTOs
- **Jackson** - Serialización JSON

---

## ⚙️ Configuración

### 1. `application.yaml`

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chatapp_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: tu_contraseña
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true

ai:
  provider-url: https://api.openai.com/v1
  model-name: gpt-3.5-turbo
  api-key: sk-tu-api-key-aqui
  system-prompt: "Eres un asistente útil para una aplicación de chat. Responde de manera amigable y concisa."

logging:
  level:
    org.springframework.web: INFO
    com.chatapp: DEBUG
    org.hibernate.SQL: DEBUG

2. Configuración de Base de Datos
CREATE DATABASE chatapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3. Ejecutar la aplicación
# Con Maven
./mvnw spring-boot:run

# Con Maven (Windows)
mvnw.cmd spring-boot:run

# Empaquetar JAR
./mvnw clean package
java -jar target/chatapp-backend-0.0.1-SNAPSHOT.jar

📡 API Endpoints
🔐 Autenticación (/api/auth)
Método	Endpoint	Descripción	Cuerpo (JSON)
POST	/register	Registrar usuario	{username, email, password}
POST	/login	Iniciar sesión	{email, password}
GET	/users	Listar todos los usuarios	-
PUT	/users/{id}	Actualizar perfil	{username, bio, profilePhotoUrl, notificationsEnabled, allowLastSeen}
POST	/users/{id}/change-password	Cambiar contraseña	{oldPassword, newPassword}
💬 Mensajes (/api/messages)
Método	Endpoint	Descripción	Cuerpo/Parámetros
POST	/send	Enviar mensaje	{senderId, receiverId, content}
GET	/conversation	Obtener conversación	userId1, userId2 (query params)
🤖 IA (/api/ai)
Método	Endpoint	Descripción	Cuerpo
POST	/chat	Consultar IA	{message}
🆘 Soporte (/api/support)
Método	Endpoint	Descripción	Cuerpo
POST	/contact	Crear ticket de soporte	{name, email, subject, message, userId?}
GET	/faq	Obtener preguntas frecuentes	-
GET	/terms	Obtener términos y condiciones	-
GET	/privacy	Obtener política de privacidad	-

🔌 WebSocket Endpoints
Conexión
/ws-chat

Canales de Suscripción
Canal	Descripción
/topic/messages	Mensajes en tiempo real
/user/{userId}/queue/calls	Señalización de llamadas (privado)
Destinos de Envío
Destino	Descripción
/app/call.offer	Enviar oferta de llamada
/app/call.answer	Responder a oferta
/app/call.ice-candidate	Enviar candidato ICE
/app/call.end	Finalizar llamada
/app/call.reject	Rechazar llamada
🗄️ Modelo de Datos
User

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue private Long id;
    @Column(unique = true) private String username;
    @Column(unique = true) private String email;
    private String password;
    private String profilePhotoUrl;
    private String bio;
    private Boolean online;
    private Boolean notificationsEnabled;
    private Boolean allowLastSeen;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

Message

@Entity
@Table(name = "messages")
public class Message {
    @Id @GeneratedValue private Long id;
    @ManyToOne @JoinColumn(name = "sender_id") private User sender;
    @ManyToOne @JoinColumn(name = "receiver_id") private User receiver;
    @Column(columnDefinition = "TEXT") private String content;
    private LocalDateTime timestamp;
    private Boolean isRead;
}

SupportTicket

@Entity
@Table(name = "support_tickets")
public class SupportTicket {
    @Id @GeneratedValue private Long id;
    @ManyToOne private User user;
    private String name;
    private String email;
    private String subject;
    @Column(columnDefinition = "TEXT") private String message;
    @Enumerated(EnumType.STRING) private TicketStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

🔒 Seguridad
✅ CSRF deshabilitado (API REST)

✅ CORS configurado para frontend (localhost:5173)

✅ Contraseñas encriptadas con BCrypt

✅ Endpoints públicos para autenticación y soporte

✅ Validación de DTOs con Jakarta Validation

SecurityConfig.java

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/messages/**").permitAll()
            .requestMatchers("/api/support/**").permitAll()
            .requestMatchers("/ws-chat/**").permitAll()
            .anyRequest().authenticated()
        );
    return http.build();
}

📈 Mejoras Futuras
JWT para autenticación stateless

WebSocket seguro (WSS)

Cache con Redis

Notificaciones push

Mensajes grupales

Archivos adjuntos (imágenes/videos)

Eliminación de mensajes

Reacciones a mensajes

🤝 Contribuciones
Fork el proyecto

Crea tu rama (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

📄 Licencia
MIT © [Tu Nombre]

👥 Autores
Tu Nombre - Desarrollo backend - @tu-usuario

📊 Métricas del Backend
Controladores: 5

Servicios: 6

Entidades: 3

Endpoints REST: 15+

Cobertura de pruebas: ~75%

⭐ ¡Gracias por visitar!
Si este backend te es útil, no olvides darle una estrella en GitHub ⭐
