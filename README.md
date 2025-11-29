# chatBoot-v1.0.0-

Endpoints Disponibles:

Autenticación:
POST /api/auth/register - Registrar usuario
POST /api/auth/login - Iniciar sesión
GET /api/auth/check-username/{username} - Verificar username
GET /api/auth/check-email/{email} - Verificar email

Usuarios:
GET /api/users/me - Usuario actual
GET /api/users/{id} - Usuario por ID
GET /api/users/search?query=... - Buscar usuarios
PUT /api/users/profile - Actualizar perfil

Chats:
POST /api/chats/private/{userId} - Crear chat privado
POST /api/chats/group - Crear chat grupal
GET /api/chats - Listar chats del usuario

Mensajes:
POST /api/messages/{chatId} - Enviar mensaje
GET /api/messages/{chatId} - Obtener mensajes (paginado)

WebSocket:
ws://localhost:8081/ws - Endpoint WebSocket
Suscripciones: /topic/chat/{chatId}, /user/queue/notifications

Salud:
GET /api/health - Health check

Pruebas Rápidas:
Health Check: curl http://localhost:8081/api/health
Registro: Usa los usuarios de prueba creados automáticamente
Login: Usa credenciales: alexdoe/password123
