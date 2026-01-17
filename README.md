# Chat Application Backend

Backend para aplicación de chat desarrollado con Spring Boot, PostgreSQL y WebSocket.

## Características

- ✅ Autenticación JWT
- ✅ Chat en tiempo real con WebSocket
- ✅ Gestión de usuarios y perfiles
- ✅ Configuración de notificaciones
- ✅ Configuración de privacidad y seguridad
- ✅ Base de datos PostgreSQL
- ✅ API RESTful
- ✅ Dockerizado

## Tecnologías

- Java 17
- Spring Boot 3.2.x
- Spring Security
- Spring Data JPA
- WebSocket (STOMP)
- PostgreSQL
- JWT
- Docker

## Requisitos Previos

- Java 17 o superior
- Maven 3.8+
- PostgreSQL 15+
- Docker (opcional)

## Configuración Local

### 1. Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb chatdb

# O usar Docker
docker run --name chat-postgres \
  -e POSTGRES_DB=chatdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine