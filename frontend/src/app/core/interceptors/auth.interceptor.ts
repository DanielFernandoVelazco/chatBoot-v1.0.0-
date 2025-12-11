import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Agregar token a las requests
        const token = this.authService.getToken();

        if (token) {
            request = this.addToken(request, token);
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Token expirado - podríamos implementar refresh token aquí
                    this.authService.logout();
                    window.location.reload();
                }
                return throwError(() => error);
            })
        );
    }

    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}