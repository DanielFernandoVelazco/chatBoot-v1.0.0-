import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        // TEMPORAL: Para probar la interfaz, simular que el usuario NO está logueado
        // En producción, usar: if (!this.authService.isLoggedIn()) 
        const isLoggedIn = true; // Cambiar a false para ver login

        if (!isLoggedIn) {
            return true;
        } else {
            // Redirigir al chat si ya está autenticado
            this.router.navigate(['/chat']);
            return false;
        }
    }
}