import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { User } from '../models/user.model'; // ✅ Corregir import

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadCurrentUser();
    }

    login(loginRequest: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
            .pipe(
                tap(response => {
                    this.setToken(response.token);
                    this.loadCurrentUser();
                })
            );
    }

    register(registerRequest: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
            .pipe(
                tap(response => {
                    this.setToken(response.token);
                    this.loadCurrentUser();
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    private loadCurrentUser(): void {
        const token = this.getToken();
        if (token) {
            // En una implementación real, haríamos una llamada al backend
            // Por ahora, cargamos desde localStorage o dejamos null
            const user = localStorage.getItem('currentUser');
            if (user) {
                this.currentUserSubject.next(JSON.parse(user));
            }
        }
    }

    checkUsernameAvailability(username: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/check-username/${username}`);
    }

    checkEmailAvailability(email: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`);
    }
}