import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../shared/models/auth.model';
import { GameTitleComponent } from '../../shared/components/game-title/game-title.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    GameTitleComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  form: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isFormValid = signal(false);

  constructor() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Subscribe to form changes and update signal
    this.form.statusChanges.subscribe(() => {
      this.isFormValid.set(this.form.valid);
    });

    // Set initial value
    this.isFormValid.set(this.form.valid);
  }

  // Submit login form
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const loginRequest: LoginRequest = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.authService.saveToken(response.data.token);
          this.authService.refreshCurrentUser().subscribe({
            next: (userResponse) => {
              if (userResponse.success && userResponse.data) {
                this.router.navigate(['/']);
              }
            },
            error: () => {
              this.errorMessage.set('Failed to load user data');
            },
          });
        } else {
          this.errorMessage.set(response.message || 'Login failed. Please try again.');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        if (error?.error?.message) {
          this.errorMessage.set(error.error.message);
        } else {
          this.errorMessage.set('Error connecting to server. Please try again.');
        }
        this.isLoading.set(false);
      },
    });
  }

  // Get form controls for template
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
