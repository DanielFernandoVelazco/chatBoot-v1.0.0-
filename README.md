ChatApp Backend (Spring Boot + PostgreSQL)
API RESTful para una aplicación de mensajería instantánea. Desarrollada con Java 17, Spring Boot, JPA y PostgreSQL.

🛠 Tech Stack
Java 17
Spring Boot 3.x
Spring Data JPA
Spring Security
PostgreSQL
Maven
Lombok
📋 Requisitos Previos
Java 17 instalado.
Maven instalado.
Docker (opcional, recomendado para la base de datos).
🚀 Instalación y Ejecución
Clonar el repositorio y entrar en el directorio:
cd chatapp-backend
Configurar la Base de Datos (Docker):
Ejecuta el siguiente comando para levantar una instancia de PostgreSQL rápidamente:

docker run --name chatapp-postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=chatapp_db -p 5432:5432 -d postgres:latest

Configurar Variables de Entorno:
Copia el archivo de ejemplo:

cp .env.example .env

(Edita .env si necesitas cambiar el puerto o la contraseña).
Compilar el proyecto:

mvn clean install

Ejecutar la aplicación:

mvn spring-boot:run

La aplicación iniciará en http://localhost:8081.
🧪 Ejecutar Tests
Para ejecutar los tests de integración y unitarios:

mvn test

🏗 Estructura del Proyecto

src/
├── main/
│   ├── java/
│   │   └── com/chatapp/chatapp_backend/
│   │       ├── ChatappBackendApplication.java
│   │       ├── config/
│   │       │   └── SecurityConfig.java        # Configuración de Seguridad y CORS
│   │       ├── controller/
│   │       │   └── AuthController.java        # Endpoints de Autenticación
│   │       ├── dto/
│   │       │   ├── UserRegistrationDto.java  # Datos de entrada
│   │       │   └── UserResponseDto.java      # Datos de salida (Sin password)
│   │       ├── model/
│   │       │   └── User.java                 # Entidad JPA
│   │       ├── repository/
│   │       │   └── UserRepository.java        # Interfaz JPA
│   │       └── service/
│   │           ├── UserService.java           # Interfaz Servicio
│   │           └── UserServiceImpl.java      # Lógica de Negocio
│   └── resources/
│       └── application.yaml                  # Configuración (usa variables de entorno)
└── test/
    └── java/
        └── com/chatapp/chatapp_backend/
            └── repository/
                └── UserRepositoryTest.java    # Tests de integración DB

📡 Endpoints (API)
Registro de Usuario
POST /api/auth/register
Descripción: Registra un nuevo usuario en la base de datos.
Body (JSON):

{
  "username": "ejemplo_usuario",
  "email": "usuario@ejemplo.com",
  "password": "password123"
}

Response (200 OK):

{
  "id": 1,
  "username": "ejemplo_usuario",
  "email": "usuario@ejemplo.com",
  "profilePhotoUrl": null,
  "bio": null,
  "online": false,
  "createdAt": "2024-01-26T21:00:00"
}

🔐 Seguridad
El proyecto utiliza Spring Security.
Los endpoints bajo /api/auth/** son públicos.
Se ha configurado CORS para permitir conexiones desde el frontend (por defecto *).
*Nota: La contraseña aún no está encriptada en esta fase (Próximo paso de mejora).