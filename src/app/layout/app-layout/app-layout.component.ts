import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  // Convert router url to signal
  private readonly routerUrl = toSignal(this.router.events.pipe(map(() => this.router.url)), {
    initialValue: this.router.url,
  });

  // Now it reacts to changes in the router URL
  showUsername = computed(() => this.routerUrl() === '/');
  showBackButton = computed(() => this.routerUrl() !== '/');
  showLogoutButton = computed(() => this.routerUrl() === '/');

  // Logout and redirect to login
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  // Go back to previous page
  goBack(): void {
    this.router.navigate(['/']);
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }
}
