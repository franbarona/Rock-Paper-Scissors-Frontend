import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth-guard';
import { RegisterComponent } from './pages/register/register.component';
import { MenuComponent } from './pages/menu/menu.component';
import { GameComponent } from './pages/game/game.component';

export const routes: Routes = [
  // Login route (no layout, no guard)
  {
    path: 'login',
    component: LoginComponent,
  },
  // Register route (no layout, no guard)
  {
    path: 'register',
    component: RegisterComponent,
  },
  // Protected routes with layout and guard
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Default route to menu
      {
        path: '',
        component: MenuComponent,
      },
      // Game route
      {
        path: 'game',
        component: GameComponent,
      },
    ],
  },
  // Redirect empty path to login
  {
    path: '**',
    redirectTo: 'login',
  },
];
