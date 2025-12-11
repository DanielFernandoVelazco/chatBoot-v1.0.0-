import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ChatService } from '../../../../core/services/chat.service';
import { UserService } from '../../../../core/services/user.service';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { Chat, ChatType } from '../../../../core/models/chat.model';
import { User } from '../../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  currentUser: User | null = null;
  selectedChat: Chat | null = null;
  searchQuery = '';
  isSidebarOpen = true;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService,
    private websocketService: WebSocketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadMockChats(); // Cargar chats de prueba
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.websocketService.disconnect();
  }

  loadCurrentUser(): void {
    // Usuario mock para probar
    this.currentUser = {
      id: '1',
      username: 'alexdoe',
      email: 'alex@example.com',
      fullName: 'Alex Doe',
      bio: 'Desarrollador Full Stack',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'ONLINE',
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      privacySettings: {
        lastSeenVisibility: 'EVERYONE',
        profilePictureVisibility: 'EVERYONE',
        infoVisibility: 'EVERYONE',
        readReceipts: true
      },
      notificationSettings: {
        desktopNotifications: true,
        soundEnabled: true,
        notificationTone: 'default',
        messageNotificationType: 'ALL',
        doNotDisturb: false
      },
      contacts: ['2', '3', '4']
    };
  }

  loadMockChats(): void {
    // Datos mock para probar la interfaz
    this.chats = [
      {
        id: '1',
        type: ChatType.PRIVATE,
        participantIds: ['1', '2'],
        lastMessage: {
          messageId: '101',
          content: '¡Hola! ¿Cómo estás?',
          senderId: '2',
          senderName: 'Elena Rodriguez',
          timestamp: new Date(Date.now() - 300000), // 5 minutos atrás
          messageType: 'TEXT' as any
        },
        settings: {
          notificationsEnabled: true,
          customNotificationTone: 'default',
          isArchived: false,
          isPinned: false
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1'
      },
      {
        id: '2',
        type: ChatType.PRIVATE,
        participantIds: ['1', '3'],
        lastMessage: {
          messageId: '102',
          content: '¿Podemos revisar el proyecto mañana?',
          senderId: '3',
          senderName: 'Marcus Chen',
          timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
          messageType: 'TEXT' as any
        },
        settings: {
          notificationsEnabled: true,
          customNotificationTone: 'default',
          isArchived: false,
          isPinned: true
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1'
      },
      {
        id: '3',
        type: ChatType.GROUP,
        name: 'Equipo de Desarrollo',
        description: 'Chat del equipo de desarrollo',
        participantIds: ['1', '2', '3', '4'],
        lastMessage: {
          messageId: '103',
          content: 'He subido los últimos cambios al repositorio',
          senderId: '4',
          senderName: 'Aisha Khan',
          timestamp: new Date(Date.now() - 86400000), // 1 día atrás
          messageType: 'TEXT' as any
        },
        settings: {
          notificationsEnabled: true,
          customNotificationTone: 'default',
          isArchived: false,
          isPinned: false
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1'
      },
      {
        id: '4',
        type: ChatType.PRIVATE,
        participantIds: ['1', '4'],
        lastMessage: {
          messageId: '104',
          content: '¿Vas a la reunión de esta tarde?',
          senderId: '4',
          senderName: 'Aisha Khan',
          timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
          messageType: 'TEXT' as any
        },
        settings: {
          notificationsEnabled: true,
          customNotificationTone: 'default',
          isArchived: false,
          isPinned: false
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1'
      },
      {
        id: '5',
        type: ChatType.GROUP,
        name: 'Amigos',
        description: 'Chat grupal con amigos',
        participantIds: ['1', '2', '3'],
        lastMessage: {
          messageId: '105',
          content: '¡La fiesta del sábado va a ser increíble! 🎉',
          senderId: '2',
          senderName: 'Elena Rodriguez',
          timestamp: new Date(Date.now() - 172800000), // 2 días atrás
          messageType: 'TEXT' as any
        },
        settings: {
          notificationsEnabled: true,
          customNotificationTone: 'default',
          isArchived: false,
          isPinned: true
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1'
      }
    ];

    // Seleccionar el primer chat por defecto
    if (this.chats.length > 0 && !this.selectedChat) {
      this.selectedChat = this.chats[0];
    }
  }

  connectWebSocket(): void {
    this.websocketService.connect();

    this.subscriptions.add(
      this.websocketService.connected$.subscribe(connected => {
        if (connected) {
          console.log('WebSocket connected');
        }
      })
    );
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
  }

  getChatDisplayName(chat: Chat): string {
    if (chat.type === ChatType.GROUP) {
      return chat.name || 'Grupo sin nombre';
    }

    // Para chats privados, nombres mock
    const userNames: { [key: string]: string } = {
      '2': 'Elena Rodriguez',
      '3': 'Marcus Chen',
      '4': 'Aisha Khan'
    };

    if (this.currentUser) {
      const otherParticipantId = chat.participantIds.find(id => id !== this.currentUser!.id);
      return userNames[otherParticipantId!] || `Usuario ${otherParticipantId}`;
    }

    return 'Chat privado';
  }

  getChatLastMessage(chat: Chat): string {
    return chat.lastMessage?.content || 'No hay mensajes';
  }

  getChatTime(chat: Chat): string {
    if (!chat.lastMessage?.timestamp) return '';

    const messageDate = new Date(chat.lastMessage.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return messageDate.toLocaleDateString();
  }

  getChatAvatar(chat: Chat): string {
    if (chat.type === ChatType.GROUP) {
      return 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=150&h=150&fit=crop&crop=face';
    }

    // Avatares para usuarios específicos
    const userAvatars: { [key: string]: string } = {
      '2': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      '3': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      '4': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    };

    if (this.currentUser) {
      const otherParticipantId = chat.participantIds.find(id => id !== this.currentUser!.id);
      return userAvatars[otherParticipantId!] || 'https://via.placeholder.com/150';
    }

    return 'https://via.placeholder.com/150';
  }

  isChatOnline(chat: Chat): boolean {
    // Simular estado en línea para algunos chats
    if (chat.type === ChatType.PRIVATE && this.currentUser) {
      const otherParticipantId = chat.participantIds.find(id => id !== this.currentUser!.id);
      return ['2', '3'].includes(otherParticipantId!); // Elena y Marcus están online
    }
    return false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  createNewChat(): void {
    // Implementar creación de nuevo chat
    console.log('Crear nuevo chat');
    alert('Funcionalidad de crear nuevo chat por implementar');
  }

  sendMessage(): void {
    if (this.selectedChat) {
      // Implementar envío de mensaje
      console.log('Enviar mensaje en chat:', this.selectedChat.id);
      alert('Funcionalidad de enviar mensaje por implementar');
    }
  }

  makeCall(): void {
    if (this.selectedChat) {
      alert(`Llamando a ${this.getChatDisplayName(this.selectedChat)}...`);
    }
  }

  startVideoCall(): void {
    if (this.selectedChat) {
      alert(`Iniciando videollamada con ${this.getChatDisplayName(this.selectedChat)}...`);
    }
  }

  searchChats(): void {
    if (this.searchQuery.trim()) {
      // Implementar búsqueda
      console.log('Buscando:', this.searchQuery);
    }
  }
}