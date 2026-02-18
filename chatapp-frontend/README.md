# 💬 ChatApp - Aplicación de Mensajería en Tiempo Real

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-brightgreen)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descripción

**ChatApp** es una aplicación de mensajería moderna y completa que permite comunicación en tiempo real entre usuarios, con funcionalidades avanzadas como chat con IA, llamadas de voz y videollamadas, y un sistema completo de gestión de usuarios.

La aplicación está construida con una arquitectura de microservicios utilizando **Spring Boot** en el backend y **React** en el frontend, comunicándose mediante WebSockets para mensajería instantánea y WebRTC para llamadas peer-to-peer.

---

## ✨ Características Principales

### 💬 Mensajería
- ✅ **Chat en tiempo real** con WebSocket
- ✅ **Conversaciones 1 a 1** entre usuarios
- ✅ **Envío de imágenes** en el chat
- ✅ **Emojis** integrados
- ✅ **Historial de mensajes** persistente

### 🤖 Asistente IA
- ✅ **Modo IA** para consultar al asistente
- ✅ Respuestas automáticas inteligentes
- ✅ Integración con API de OpenAI

### 📞 Llamadas
- ✅ **Llamadas de voz** peer-to-peer (WebRTC)
- ✅ **Videollamadas** con calidad HD
- ✅ **Controles** (silenciar, activar/desactivar cámara)
- ✅ **Modal de llamada** con temporizador
- ✅ **Señalización** vía WebSocket

### 👤 Gestión de Usuarios
- ✅ **Registro** e **inicio de sesión**
- ✅ **Edición de perfil** (nombre, bio, foto)
- ✅ **Cambio de contraseña** seguro
- ✅ **Configuración de privacidad** (última vez visto)
- ✅ **Notificaciones** configurables

### 🆘 Centro de Ayuda
- ✅ **Preguntas Frecuentes** dinámicas
- ✅ **Contacto con soporte** (tickets)
- ✅ **Términos y condiciones**
- ✅ **Política de privacidad**
- ✅ **Gestión de cuenta** (guías)
- ✅ **Seguridad y privacidad** (consejos)
- ✅ **Resolución de problemas** (troubleshooting)
- ✅ **Estado del sistema** en tiempo real

---

## 🏗️ Arquitectura del Proyecto

chatapp/
├── backend/ # Spring Boot Application
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/chatapp/chatapp_backend/
│ │ │ │ ├── config/ # Configuraciones (Security, WebSocket)
│ │ │ │ ├── controller/ # Controladores REST y WebSocket
│ │ │ │ ├── dto/ # Data Transfer Objects
│ │ │ │ ├── model/ # Entidades JPA
│ │ │ │ ├── repository/ # Repositorios Spring Data
│ │ │ │ └── service/ # Lógica de negocio
│ │ │ └── resources/
│ │ │ └── application.yaml
│ │ └── test/
│ └── pom.xml
│
└── frontend/ # React Application
├── public/
├── src/
│ ├── components/ # Componentes reutilizables
│ ├── pages/ # Páginas de la aplicación
│ │ └── help/ # Componentes del centro de ayuda
│ ├── App.jsx # Componente principal
│ ├── main.jsx # Punto de entrada
│ └── index.css # Estilos globales
├── index.html
├── package.json
└── vite.config.js # Configuración de Vite


---

## 🚀 Tecnologías Utilizadas

### Backend
- **Java 17** - Lenguaje principal
- **Spring Boot 3.1** - Framework
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia
- **WebSocket (STOMP)** - Comunicación en tiempo real
- **MySQL** - Base de datos
- **Lombok** - Reducción de código boilerplate
- **BCrypt** - Encriptación de contraseñas

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **STOMP.js + SockJS** - Cliente WebSocket
- **Simple-Peer** - WebRTC para llamadas
- **React Hooks** - Gestión de estado

---

## ⚙️ Requisitos Previos

- **Java 17** o superior
- **Node.js 18** o superior
- **MySQL 8** o superior
- **Maven 3.8** o superior
- **npm** o **yarn**

---

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/chatapp.git
cd chatapp

2. Configurar Base de Datos

CREATE DATABASE chatapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3. Configurar Backend
cd backend
# Editar src/main/resources/application.yaml con tus credenciales

application.yaml:

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chatapp_db
    username: tu_usuario
    password: tu_contraseña
  
ai:
  provider-url: https://api.openai.com/v1
  model-name: gpt-3.5-turbo
  api-key: tu_api_key_openai
  system-prompt: "Eres un asistente útil para una aplicación de chat."
  
  4. Ejecutar Backend
# Con Maven
./mvnw spring-boot:run

# O desde tu IDE (IntelliJ, Eclipse, etc.)

5. Configurar Frontend
cd ../frontend
npm install

6. Ejecutar Frontend
npm run dev

7. Acceder a la aplicación
Frontend: http://localhost:5173
Backend API: http://localhost:8081
WebSocket: ws://localhost:8081/ws-chat

📚 Documentación Adicional
Backend README - Detalles del backend

Frontend README - Detalles del frontend

API Documentation - Endpoints REST

🎯 Funcionalidades por Implementar
Mensajes grupales

Reacciones a mensajes (👍, ❤️, etc.)

Notificaciones push

Modo oscuro/claro

Búsqueda de mensajes

Eliminación de mensajes

Autenticación de dos factores (2FA)

Llamadas grupales

🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

Fork el proyecto

Crea una rama (git checkout -b feature/NuevaCaracteristica)

Commit tus cambios (git commit -m 'Agrega nueva característica')

Push a la rama (git push origin feature/NuevaCaracteristica)

Abre un Pull Request

Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

👥 Autores
Tu Nombre - Desarrollo inicial - @tu-usuario

🙏 Agradecimientos
OpenAI por la API de IA

Simple-Peer por la biblioteca WebRTC

Tailwind CSS por los estilos

Spring Boot por el framework backend

⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub ⭐


