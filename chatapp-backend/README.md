# ⚙️ ChatApp - Backend (Spring Boot)

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-purple)
![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![License](https://img.shields.io/badge/license-MIT-green)

---

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

```bash
backend/
├── src/
│   ├── main/
│   │   ├── java/com/chatapp/chatapp_backend/
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   └── AppConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── MessageController.java
│   │   │   │   ├── AIController.java
│   │   │   │   ├── SupportController.java
│   │   │   │   └── CallController.java
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       ├── application.yaml
│   │       └── static/
│   └── test/
├── pom.xml
└── README.md
```

---

## 🚀 Tecnologías Utilizadas

### 🖥️ Core
- **Java 17**
- **Spring Boot 3.1**
- **Spring MVC**
- **Spring Data JPA**
- **Hibernate**

### 🔒 Seguridad
- **Spring Security**
- **BCrypt**
- **CORS**

### 🔌 Comunicación
- **WebSocket (STOMP)**
- **SockJS**
- **RestTemplate**

### 🗄️ Base de Datos
- **MySQL 8**
- **H2** (opcional para pruebas)

### 🧰 Utilidades
- **Lombok**
- **Jakarta Validation**
- **Jackson**

---

## ⚙️ Configuración

### 1️⃣ application.yaml

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
  system-prompt: "Eres un asistente útil para una aplicación de chat."

logging:
  level:
    org.springframework.web: INFO
    com.chatapp: DEBUG
    org.hibernate.SQL: DEBUG
```

---

### 2️⃣ Base de Datos

```sql
CREATE DATABASE chatapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3️⃣ Ejecutar Aplicación

```bash
./mvnw spring-boot:run
```

Empaquetar:

```bash
./mvnw clean package
java -jar target/chatapp-backend-0.0.1-SNAPSHOT.jar
```

---

## 📡 API Endpoints

### 🔐 Autenticación (/api/auth)

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | /register | Registrar usuario |
| POST | /login | Iniciar sesión |
| GET | /users | Listar usuarios |
| PUT | /users/{id} | Actualizar perfil |
| POST | /users/{id}/change-password | Cambiar contraseña |

### 💬 Mensajes (/api/messages)

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | /send | Enviar mensaje |
| GET | /conversation | Obtener conversación |

### 🤖 IA (/api/ai)

| Método | Endpoint |
|--------|----------|
| POST | /chat |

### 🆘 Soporte (/api/support)

| Método | Endpoint |
|--------|----------|
| POST | /contact |
| GET | /faq |
| GET | /terms |
| GET | /privacy |

---

## 🔌 WebSocket

Conexión:

```
ws://localhost:8081/ws-chat
```

Canales:

- `/topic/messages`
- `/user/{userId}/queue/calls`

Destinos:

- `/app/call.offer`
- `/app/call.answer`
- `/app/call.ice-candidate`
- `/app/call.end`
- `/app/call.reject`

---

## 🔒 Seguridad

- ✅ CSRF deshabilitado (API REST)
- ✅ CORS configurado
- ✅ BCrypt para contraseñas
- ✅ Validación con Jakarta Validation

---

## 📈 Mejoras Futuras

- JWT stateless
- WebSocket seguro (WSS)
- Redis cache
- Notificaciones push
- Mensajes grupales
- Reacciones
- Archivos adjuntos

---

## 🤝 Contribuciones

1. Fork
2. `git checkout -b feature/AmazingFeature`
3. `git commit -m "Add AmazingFeature"`
4. `git push origin feature/AmazingFeature`
5. Pull Request

---

## 📄 Licencia

MIT © Tu Nombre

---

## 👥 Autores

Tu Nombre – Backend Developer – @tu-usuario

---

⭐ Si este backend te es útil, dale una estrella en GitHub ⭐

