import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../shared/models/auth.model';
import { GameTitleComponent } from "../../shared/components/game-title/game-title.component";
import { ErrorMessageComponent } from "../../shared/components/error-message/error-message.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, GameTitleComponent, ErrorMessageComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  form: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isFormValid = signal(false);

  constructor() {
    this.form = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
        email: ['', [Validators.required, Validators.email]],
        emailConfirm: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: this.emailMatchValidator },
    );

    // Subscribe to form changes and update signal
    this.form.statusChanges.subscribe(() => {
      this.isFormValid.set(this.form.valid);
    });

    // Set initial value
    this.isFormValid.set(this.form.valid);
  }

  // Custom validator to check if email and emailConfirm match
  private emailMatchValidator(group: AbstractControl): ValidationErrors | null {
    const email = group.get('email');
    const emailConfirm = group.get('emailConfirm');

    return email && emailConfirm && email.value === emailConfirm.value
      ? null
      : { emailMismatch: true };
  }

  // Submit login form
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const registerRequest: RegisterRequest = {
      username: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.authService.saveUserData(response.data);
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set(response.message || 'Registration failed. Please try again.');
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
  get username() {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get emailConfirm() {
    return this.form.get('emailConfirm');
  }

  get password() {
    return this.form.get('password');
  }
}
