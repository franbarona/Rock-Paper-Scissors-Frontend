import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UpdateUserRequest, User } from '../../shared/models/user.model';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SuccessMessageComponent } from '../../shared/components/success-message/success-message.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ErrorMessageComponent, SuccessMessageComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  form: FormGroup;
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isFormValid = signal(false);
  currentUser = signal<User | null>(null);
  hasChanges = signal(false);
  private initialFormValues: any = null;

  constructor() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.form.statusChanges.subscribe(() => {
      this.isFormValid.set(this.form.valid);
    });

    this.form.valueChanges.subscribe(() => {
      this.checkForChanges();
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUser.set(response.data);
          this.form.patchValue({
            username: response.data.username,
            email: response.data.email,
          });
          this.initialFormValues = this.form.value;
          this.isFormValid.set(this.form.valid);
          this.hasChanges.set(false);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load user data. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  private checkForChanges(): void {
    if (!this.initialFormValues) {
      this.hasChanges.set(false);
      return;
    }

    const currentValues = this.form.value;
    const changed = 
      currentValues.username !== this.initialFormValues.username ||
      currentValues.email !== this.initialFormValues.email;
    
    this.hasChanges.set(changed);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const updateRequest: UpdateUserRequest = {
      username: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
    };

    this.userService.updateUser(updateRequest).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUser.set(response.data);
          this.authService.setCurrentUser(response.data);
          this.successMessage.set('Profile updated successfully');
          this.initialFormValues = this.form.value;
          this.hasChanges.set(false);

          setTimeout(() => {
            this.successMessage.set(null);
          }, 3000);
        } else {
          this.errorMessage.set(response.message || 'Failed to update profile');
        }
        this.isSaving.set(false);
      },
      error: (error) => {
        if (error?.error?.message) {
          this.errorMessage.set(error.error.message);
        } else {
          this.errorMessage.set('Error connecting to server. Please try again.');
        }
        this.isSaving.set(false);
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
}
