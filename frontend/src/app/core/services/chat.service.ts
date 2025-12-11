import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chat, ChatSettings } from '../models/chat.model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = `${environment.apiUrl}/chats`;

    constructor(private http: HttpClient) { }

    createPrivateChat(userId: string): Observable<Chat> {
        return this.http.post<Chat>(`${this.apiUrl}/private/${userId}`, {});
    }

    createGroupChat(name: string, description: string, participantIds: string[]): Observable<Chat> {
        return this.http.post<Chat>(`${this.apiUrl}/group`, {
            name,
            description,
            participantIds
        });
    }

    getUserChats(): Observable<Chat[]> {
        return this.http.get<Chat[]>(this.apiUrl);
    }

    getChatById(chatId: string): Observable<Chat> {
        return this.http.get<Chat>(`${this.apiUrl}/${chatId}`);
    }

    updateChatSettings(chatId: string, settings: ChatSettings): Observable<Chat> {
        return this.http.put<Chat>(`${this.apiUrl}/${chatId}/settings`, settings);
    }

    archiveChat(chatId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${chatId}/archive`, {});
    }

    pinChat(chatId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${chatId}/pin`, {});
    }

    unpinChat(chatId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${chatId}/unpin`, {});
    }

    getPrivateChatBetweenUsers(user1Id: string, user2Id: string): Observable<Chat> {
        return this.http.get<Chat>(`${this.apiUrl}/private/${user1Id}/${user2Id}`);
    }
}