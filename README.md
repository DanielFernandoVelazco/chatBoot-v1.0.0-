# Primeros pasos – ChatBoot v1.0.0

## Descripción general
Este documento guía la configuración y ejecución de **ChatBoot v1.0.0** en un entorno local, incluyendo:
- Frontend en **React + Vite**
- Backend en **Spring Boot**
- Base de datos **PostgreSQL**
- Integración con un proveedor de IA compatible con OpenAI

Al finalizar, la aplicación de chat estará funcionando localmente.

---

## Arquitectura del sistema

| Componente | Tecnología | Puerto | Directorio |
|----------|-----------|--------|------------|
| Frontend | React + Vite | 5173 | chatapp-frontend |
| Backend | Spring Boot 4.0.2 | 8081 | chatapp-backend |

Servicios externos requeridos:
- PostgreSQL
- API de proveedor de IA (OpenAI o compatible)

---

## Requisitos previos

- JDK 17  
- Maven  
- Node.js 18+ y npm  
- PostgreSQL 12+  
- Clave API del proveedor de IA  

---

## Configuración del Backend

### 1. Base de datos
```sql
CREATE DATABASE chatapp;
CREATE USER chatapp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE chatapp TO chatapp_user;
```

### 2. Variables de entorno (.env)
```env
DB_URL=jdbc:postgresql://localhost:5432/chatapp
DB_USER=chatapp_user
DB_PASSWORD=your_password
SERVER_PORT=8081
AI_PROVIDER_URL=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo
AI_API_KEY=sk-your-openai-api-key
```

### 3. Ejecución
```bash
cd chatapp-backend
mvn clean install
mvn spring-boot:run
```

Backend disponible en: http://localhost:8081

---

## Configuración del Frontend

### Instalación
```bash
cd chatapp-frontend
npm install
```

### Ejecución
```bash
npm run dev
```

Frontend disponible en: http://localhost:5173

---

## Verificación

- Backend:
```bash
curl http://localhost:8081/api/auth/users
```

- Frontend:
Abrir http://localhost:5173 en el navegador.

- WebSocket:
Conexión a `ws://localhost:8081/ws-chat`

---

## Perfiles de entorno

| Perfil | Base de datos | Uso |
|------|---------------|-----|
| Desarrollo | H2 en memoria | Pruebas locales |
| Producción | PostgreSQL | Despliegue |

Ejemplo H2:
```env
DB_URL=jdbc:h2:mem:testdb
DB_USER=sa
DB_PASSWORD=
```

---

## Seguridad

- CORS: http://localhost:5173
- CSRF: deshabilitado
- Endpoints públicos:
  - /api/auth/**
  - /api/messages/**
  - /ws-chat/**
- Hash de contraseñas: BCrypt

---

## Solución de problemas comunes

- **Driver PostgreSQL no encontrado**: verificar DB_URL y servicio activo
- **Errores CORS**: confirmar puerto 5173
- **401 en IA**: validar AI_API_KEY

---

## Próximos pasos

- Arquitectura
- Autenticación de usuarios
- Mensajería en tiempo real
- Referencia de la API
- Modelos de datos
