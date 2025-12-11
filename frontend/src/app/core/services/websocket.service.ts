import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface WebSocketMessage {
    id?: string;
    chatId?: string;
    senderId?: string;
    senderName?: string;
    content?: string;
    type?: string;
    timestamp?: Date;
    action?: string;
    previousContent?: string;
    emoji?: string;
    reactionUserId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private stompClient: Client | null = null;
    private connectedSubject = new BehaviorSubject<boolean>(false);
    public connected$ = this.connectedSubject.asObservable();

    constructor(private authService: AuthService) { }

    connect(): void {
        if (this.stompClient && this.stompClient.connected) {
            return;
        }

        const socket = new SockJS(`${environment.wsUrl}`);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str: string) => {
                console.log('STOMP: ', str);
            }
        });

        this.stompClient.onConnect = (frame: any) => {
            console.log('Connected: ' + frame);
            this.connectedSubject.next(true);
        };

        this.stompClient.onWebSocketError = (error: any) => {
            console.error('WebSocket error: ', error);
            this.connectedSubject.next(false);
        };

        this.stompClient.onStompError = (frame: any) => {
            console.error('STOMP error: ', frame);
            this.connectedSubject.next(false);
        };

        this.stompClient.activate();
    }

    disconnect(): void {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.connectedSubject.next(false);
        }
    }

    sendMessage(chatId: string, message: WebSocketMessage): void {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: `/app/chat/${chatId}/send`,
                body: JSON.stringify(message)
            });
        }
    }

    subscribeToChat(chatId: string): Observable<WebSocketMessage> {
        return new Observable<WebSocketMessage>(observer => {
            if (this.stompClient && this.stompClient.connected) {
                const subscription = this.stompClient.subscribe(
                    `/topic/chat/${chatId}`,
                    (message: IMessage) => {
                        observer.next(JSON.parse(message.body));
                    }
                );

                return () => {
                    subscription.unsubscribe();
                };
            } else {
                observer.error('WebSocket not connected');
                return () => { }; // Return empty function
            }
        });
    }

    subscribeToNotifications(): Observable<WebSocketMessage> {
        return new Observable<WebSocketMessage>(observer => {
            if (this.stompClient && this.stompClient.connected) {
                const userId = this.getCurrentUserId();
                const subscription = this.stompClient.subscribe(
                    `/user/queue/notifications`,
                    (message: IMessage) => {
                        observer.next(JSON.parse(message.body));
                    }
                );

                return () => {
                    subscription.unsubscribe();
                };
            } else {
                observer.error('WebSocket not connected');
                return () => { }; // Return empty function
            }
        });
    }

    private getCurrentUserId(): string {
        // Implementación temporal
        return 'temp-user-id';
    }

    sendTyping(chatId: string): void {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/user/typing',
                body: JSON.stringify({
                    chatId,
                    action: 'TYPING'
                })
            });
        }
    }

    sendStopTyping(chatId: string): void {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/user/stop-typing',
                body: JSON.stringify({
                    chatId,
                    action: 'STOP_TYPING'
                })
            });
        }
    }
}