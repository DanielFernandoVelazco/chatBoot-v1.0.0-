import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, PrivacySettings, NotificationSettings } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/me`);
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getUserByUsername(username: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/username/${username}`);
    }

    searchUsers(query: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/search?query=${query}`);
    }

    getOnlineUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/online`);
    }

    updateProfile(user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/profile`, user);
    }

    updateStatus(status: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/status/${status}`, {});
    }

    addContact(userId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/contacts/${userId}`, {});
    }

    removeContact(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/contacts/${userId}`);
    }

    getUserContacts(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/contacts`);
    }

    updatePrivacySettings(privacySettings: PrivacySettings): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/privacy`, privacySettings);
    }

    updateNotificationSettings(notificationSettings: NotificationSettings): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/notifications`, notificationSettings);
    }
}