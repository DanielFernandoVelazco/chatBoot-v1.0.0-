💬 ChatApp - Aplicación de Mensajería en Tiempo Real
📋 Descripción

ChatApp es una aplicación de mensajería moderna y completa que permite comunicación en tiempo real entre usuarios, con funcionalidades avanzadas como chat con IA, llamadas de voz y videollamadas, y un sistema completo de gestión de usuarios.

La aplicación está construida con una arquitectura de microservicios utilizando Spring Boot en el backend y React en el frontend, comunicándose mediante WebSockets para mensajería instantánea y WebRTC para llamadas peer-to-peer.

✨ Características Principales
💬 Mensajería

Chat en tiempo real con WebSocket

Conversaciones 1 a 1 entre usuarios

Envío de imágenes en el chat

Emojis integrados

Historial de mensajes persistente

🤖 Asistente IA

Modo IA para consultar al asistente

Respuestas automáticas inteligentes

Integración con API de OpenAI

📞 Llamadas

Llamadas de voz peer-to-peer (WebRTC)

Videollamadas con calidad HD

Controles (silenciar, activar/desactivar cámara)

Modal de llamada con temporizador

Señalización vía WebSocket

👤 Gestión de Usuarios

Registro e inicio de sesión

Edición de perfil (nombre, bio, foto)

Cambio de contraseña seguro

Configuración de privacidad (última vez visto)

Notificaciones configurables

🆘 Centro de Ayuda

Preguntas Frecuentes dinámicas

Contacto con soporte (tickets)

Términos y condiciones

Política de privacidad

Gestión de cuenta (guías)

Seguridad y privacidad (consejos)

Resolución de problemas (troubleshooting)

Estado del sistema en tiempo real

🏗️ Arquitectura del Proyecto

chatapp/
├── backend/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/chatapp/chatapp_backend/
│ │ │ │ ├── config/
│ │ │ │ ├── controller/
│ │ │ │ ├── dto/
│ │ │ │ ├── model/
│ │ │ │ ├── repository/
│ │ │ │ └── service/
│ │ │ └── resources/
│ │ │ └── application.yaml
│ │ └── test/
│ └── pom.xml
│
└── frontend/
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ │ └── help/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── index.html
├── package.json
└── vite.config.js

🚀 Tecnologías Utilizadas
Backend

Java 17

Spring Boot 3.1

Spring Security

Spring Data JPA

WebSocket (STOMP)

MySQL

Lombok

BCrypt

Frontend

React 18

Vite

Tailwind CSS

Axios

STOMP.js + SockJS

Simple-Peer

React Hooks

⚙️ Requisitos Previos

Java 17 o superior

Node.js 18 o superior

MySQL 8 o superior

Maven 3.8 o superior

npm o yarn

🔧 Instalación y Configuración
1. Clonar el repositorio

git clone https://github.com/tu-usuario/chatapp.git

cd chatapp

2. Configurar Base de Datos

CREATE DATABASE chatapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3. Configurar Backend

cd backend

Editar src/main/resources/application.yaml con tus credenciales:

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

./mvnw spring-boot:run

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

Backend README

Frontend README

API Documentation

🎯 Funcionalidades por Implementar

Mensajes grupales

Reacciones a mensajes

Notificaciones push

Modo oscuro/claro

Búsqueda de mensajes

Eliminación de mensajes

Autenticación de dos factores (2FA)

Llamadas grupales

🤝 Contribuciones

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
