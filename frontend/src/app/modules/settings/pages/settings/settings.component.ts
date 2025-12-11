import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User, PrivacySettings, NotificationSettings } from '../../../../core/models/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  activeSection = 'profile';

  profileForm: FormGroup;
  privacyForm: FormGroup;
  notificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar formularios
    this.profileForm = this.fb.group({
      fullName: [''],
      username: [''],
      email: [''],
      bio: [''],
      profilePicture: ['']
    });

    this.privacyForm = this.fb.group({
      lastSeenVisibility: ['EVERYONE'],
      profilePictureVisibility: ['EVERYONE'],
      infoVisibility: ['EVERYONE'],
      readReceipts: [true]
    });

    this.notificationForm = this.fb.group({
      desktopNotifications: [true],
      soundEnabled: [true],
      notificationTone: ['default'],
      messageNotificationType: ['ALL'],
      doNotDisturb: [false]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.populateForms();
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  populateForms(): void {
    if (this.currentUser) {
      // Perfil
      this.profileForm.patchValue({
        fullName: this.currentUser.fullName,
        username: this.currentUser.username,
        email: this.currentUser.email,
        bio: this.currentUser.bio,
        profilePicture: this.currentUser.profilePicture
      });

      // Privacidad
      if (this.currentUser.privacySettings) {
        this.privacyForm.patchValue(this.currentUser.privacySettings);
      }

      // Notificaciones
      if (this.currentUser.notificationSettings) {
        this.notificationForm.patchValue(this.currentUser.notificationSettings);
      }
    }
  }

  selectSection(section: string): void {
    this.activeSection = section;
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      const updatedUser = {
        ...this.currentUser,
        ...this.profileForm.value
      };

      this.userService.updateProfile(updatedUser).subscribe({
        next: (user) => {
          this.currentUser = user;
          alert('Perfil actualizado correctamente');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Error al actualizar el perfil');
        }
      });
    }
  }

  onPrivacySubmit(): void {
    if (this.privacyForm.valid) {
      this.userService.updatePrivacySettings(this.privacyForm.value).subscribe({
        next: () => {
          alert('Configuración de privacidad actualizada');
        },
        error: (error) => {
          console.error('Error updating privacy:', error);
          alert('Error al actualizar la privacidad');
        }
      });
    }
  }

  onNotificationSubmit(): void {
    if (this.notificationForm.valid) {
      this.userService.updateNotificationSettings(this.notificationForm.value).subscribe({
        next: () => {
          alert('Configuración de notificaciones actualizada');
        },
        error: (error) => {
          console.error('Error updating notifications:', error);
          alert('Error al actualizar las notificaciones');
        }
      });
    }
  }

  changeProfilePicture(): void {
    // Implementar cambio de foto de perfil
    alert('Funcionalidad de cambio de foto por implementar');
  }

  navigateToChat(): void {
    this.router.navigate(['/chat']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}