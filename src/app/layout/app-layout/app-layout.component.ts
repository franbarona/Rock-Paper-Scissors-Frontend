import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  showBackButton = false;
  currentUser$ = this.authService.currentUser;

  constructor() {
    // Show back button on specific routes
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.showBackButton = currentUrl !== '/';
    });
  }

  // Logout and redirect to login
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  // Go back to previous page
  goBack(): void {
    this.router.navigate(['/']);
  }
}
