import { Component } from '@angular/core';
import { MenuCardComponent } from '../../shared/components/menu-card/menu-card.component';

@Component({
  selector: 'app-menu',
  imports: [MenuCardComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {}
