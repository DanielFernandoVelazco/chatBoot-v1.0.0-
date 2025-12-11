import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      bio: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Si ya está logueado, redirigir al chat
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/chat']);
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;

      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('¡Registro exitoso!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            error.error?.message || 'Error en el registro',
            'Cerrar',
            { duration: 5000 }
          );
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  checkUsernameAvailability(): void {
    const username = this.registerForm.get('username')?.value;
    if (username && username.length >= 3) {
      this.authService.checkUsernameAvailability(username).subscribe({
        next: (available) => {
          if (!available) {
            this.registerForm.get('username')?.setErrors({ notAvailable: true });
          }
        }
      });
    }
  }

  checkEmailAvailability(): void {
    const email = this.registerForm.get('email')?.value;
    if (email && this.registerForm.get('email')?.valid) {
      this.authService.checkEmailAvailability(email).subscribe({
        next: (available) => {
          if (!available) {
            this.registerForm.get('email')?.setErrors({ notAvailable: true });
          }
        }
      });
    }
  }
}