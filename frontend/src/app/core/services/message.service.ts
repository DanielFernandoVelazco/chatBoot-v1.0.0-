import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, MessageType } from '../models/message.model';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = `${environment.apiUrl}/messages`;

    constructor(private http: HttpClient) { }

    sendMessage(chatId: string, content: string, type: MessageType = MessageType.TEXT): Observable<Message> {
        return this.http.post<Message>(`${this.apiUrl}/${chatId}`, {
            content,
            type
        });
    }

    getChatMessages(chatId: string, page: number = 0, size: number = 50): Observable<any> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<any>(`${this.apiUrl}/${chatId}`, { params });
    }

    getUnreadMessages(chatId: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/${chatId}/unread`);
    }

    markMessagesAsRead(chatId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${chatId}/read`, {});
    }

    editMessage(messageId: string, content: string): Observable<Message> {
        return this.http.put<Message>(`${this.apiUrl}/${messageId}`, null, {
            params: { content }
        });
    }

    deleteMessage(messageId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
    }

    addReaction(messageId: string, emoji: string): Observable<Message> {
        return this.http.post<Message>(`${this.apiUrl}/${messageId}/reaction`, null, {
            params: { emoji }
        });
    }
}