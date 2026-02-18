# 💬 ChatApp – Full Stack Real-Time Messaging Platform

![Java](https://img.shields.io/badge/Java-17-red)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-purple)
![WebRTC](https://img.shields.io/badge/WebRTC-P2P-orange)
![License](https://img.shields.io/badge/license-MIT-green)

> Plataforma de mensajería en tiempo real construida con arquitectura moderna Full Stack.  
> Diseñada para demostrar competencias avanzadas en backend empresarial, comunicación en tiempo real y diseño escalable.

---

## 📌 Resumen del Proyecto

**ChatBoot-v1.0.0-** es una aplicación de mensajería en tiempo real que integra:

- Comunicación instantánea con WebSocket (STOMP)
- Llamadas de voz y video mediante WebRTC
- Persistencia con JPA + MySQL
- Seguridad con Spring Security
- Integración con API de OpenAI
- Frontend moderno con React 18 + Vite

El proyecto simula una arquitectura lista para evolucionar a entorno productivo.

---

## 🏗️ Arquitectura

### Backend (Spring Boot)

Arquitectura en capas bien definida:

```
controller/  → Endpoints REST + WebSocket
service/     → Lógica de negocio
repository/  → Persistencia (Spring Data JPA)
dto/         → Desacoplamiento de entidades
config/      → Seguridad + WebSocket
```

**Principios aplicados:**

- Separación de responsabilidades
- Desacoplamiento mediante DTOs
- Configuración externa con `application.yaml`
- Seguridad basada en Spring Security
- Encriptación con BCrypt

---

### Frontend (React)

- Arquitectura basada en componentes
- React Hooks para gestión de estado
- Comunicación REST + WebSocket
- Integración WebRTC en navegador
- UI moderna con Tailwind CSS

---

## ⚙️ Stack Tecnológico

| Capa        | Tecnologías |
|-------------|-------------|
| Backend     | Java 17, Spring Boot 3.1, Spring Security, JPA |
| Tiempo Real | WebSocket (STOMP), WebRTC |
| Base de Datos | MySQL 8 |
| Frontend    | React 18, Vite, Tailwind |
| Integraciones | OpenAI API |

---

## 🚀 Funcionalidades Implementadas

### 💬 Mensajería
- Chat 1 a 1 en tiempo real
- Persistencia de historial
- Envío de imágenes
- Emojis
- Broadcast y mensajería dirigida

### 🤖 Asistente IA
- Modo IA integrado
- Prompt configurable
- Respuestas dinámicas vía API externa

### 📞 Llamadas
- Voz peer-to-peer
- Videollamadas HD
- Señalización mediante WebSocket
- Controles de cámara y micrófono

### 👤 Gestión de Usuarios
- Registro e inicio de sesión
- Edición de perfil
- Cambio de contraseña seguro
- Configuración de privacidad

---

## 🧠 Competencias Técnicas Demostradas

### Backend
- Diseño de API REST estructurada
- Seguridad y autenticación
- Persistencia relacional
- Manejo de concurrencia WebSocket
- Integración con servicios externos
- Arquitectura mantenible y escalable

### Tiempo Real
- Implementación de STOMP
- Gestión de sesiones activas
- Señalización WebRTC

### Frontend
- Componentización limpia
- Manejo de estado eficiente
- Integración de protocolos en tiempo real

---

## 📈 Escalabilidad y Evolución

El diseño permite evolucionar hacia:

- Autenticación JWT
- Microservicios independientes
- Redis para sesiones
- Kafka para eventos
- Docker + Docker Compose
- CI/CD
- Kubernetes
- PostgreSQL
- Almacenamiento en la nube (S3)

---

## 🛠️ Instalación

### Requisitos

- Java 17+
- Node 18+
- MySQL 8+
- Maven 3.8+

### Clonar repositorio

```bash
git clone https://github.com/tu-usuario/chatapp.git
cd chatapp
```

### Configurar base de datos

```sql
CREATE DATABASE chatapp_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### Ejecutar Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Ejecutar Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 Impacto Profesional

Este proyecto demuestra:

- Capacidad para construir sistemas en tiempo real
- Dominio de backend empresarial con Spring
- Integración full stack desacoplada
- Conocimiento profundo de protocolos (HTTP, WebSocket, WebRTC)
- Aplicación de buenas prácticas de arquitectura
- Diseño preparado para escalar

---

## 📌 Próximas Mejoras

- Chats grupales
- Reacciones a mensajes
- Notificaciones push
- Autenticación 2FA
- Dockerización completa
- Tests unitarios y de integración
- Documentación OpenAPI

---

## 👨‍💻 Autor

**Daniel Fernando Velazco**  
Backend / Full Stack Developer  

GitHub: https://github.com/DanielFernandoVelazco  
LinkedIn: https://www.linkedin.com/in/daniel-fernando-velazco-caceres/  

---

⭐ Si te interesa la arquitectura o deseas discutir mejoras técnicas, estaré encantado de conversar.

