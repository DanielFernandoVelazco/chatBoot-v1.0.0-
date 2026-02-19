# 💬 ChatApp - Aplicación de Mensajería en Tiempo Real

![Version](https://img.shields.io/badge/version-1.0.0-blue)  
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)  
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-brightgreen)  
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-purple)  
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Descripción

**ChatApp** es una aplicación de mensajería moderna y completa que permite comunicación en tiempo real entre usuarios, con funcionalidades avanzadas como chat con IA, llamadas de voz y videollamadas, y un sistema completo de gestión de usuarios.

La aplicación está construida con una arquitectura de microservicios utilizando **Spring Boot** en el backend y **React** en el frontend, comunicándose mediante **WebSockets** para mensajería instantánea y **WebRTC** para llamadas peer-to-peer.

---

## ✨ Características Principales

### 💬 Mensajería
- ✅ **Chat en tiempo real** con WebSocket  
- ✅ **Conversaciones 1 a 1** entre usuarios  
- ✅ **Envío de imágenes**  
- ✅ **Emojis integrados**  
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

```bash
chatapp/
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   └── help/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Tecnologías Utilizadas

### 🎨 Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Axios**
- **STOMP.js + SockJS**
- **Simple-Peer**
- **React Hooks**

---

## ⚙️ Requisitos Previos

- ☕ Java 17 o superior  
- 🟢 Node.js 18 o superior  
- 🗄️ MySQL 8 o superior  
- 📦 Maven 3.8 o superior  
- 📥 npm o yarn  

---

## 🔧 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/DanielFernandoVelazco/chatBoot-v1.0.0-.git
cd chatBoot-v1.0.0-
```

### 2️⃣ Configurar Base de Datos

```sql
CREATE DATABASE chatapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3️⃣ Configurar Backend

```bash
cd backend
```

Editar `src/main/resources/application.yaml`:

```yaml
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
```

### 4️⃣ Ejecutar Backend

```bash
./mvnw spring-boot:run
```

### 5️⃣ Configurar Frontend

```bash
cd ../frontend
npm install
```

### 6️⃣ Ejecutar Frontend

```bash
npm run dev
```

### 7️⃣ Acceder a la aplicación

- 🌐 **Frontend:** http://localhost:5173  
- 🔌 **Backend API:** http://localhost:8081  
- 🔄 **WebSocket:** ws://localhost:8081/ws-chat  

---

## 📚 Documentación Adicional

- 📘 Backend README  
- 📙 Frontend README  
- 📗 API Documentation  

---

## 🎯 Funcionalidades por Implementar

- 👥 Mensajes grupales  
- 👍 Reacciones a mensajes  
- 🔔 Notificaciones push  
- 🌙 Modo oscuro/claro  
- 🔍 Búsqueda de mensajes  
- 🗑️ Eliminación de mensajes  
- 🔐 Autenticación de dos factores (2FA)  
- 📞 Llamadas grupales  

---

## 🤝 Contribuciones

1. 🍴 Fork el proyecto  
2. 🌿 Crear una rama: `git checkout -b feature/NuevaCaracteristica`  
3. 💾 Commit: `git commit -m "Agrega nueva característica"`  
4. 🚀 Push: `git push origin feature/NuevaCaracteristica`  
5. 📬 Abrir Pull Request  

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.  
Consulta el archivo `LICENSE` para más detalles.

---

## 👥 Autor
**Daniel Fernando Velazco**  
Backend / Full Stack Developer  
GitHub: https://github.com/DanielFernandoVelazco  

---

## 🙏 Agradecimientos

- 🤖 OpenAI por la API de IA  
- 📡 Simple-Peer por la biblioteca WebRTC  
- 🎨 Tailwind CSS por los estilos  
- 🚀 Spring Boot por el framework backend  

---

⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub ⭐

