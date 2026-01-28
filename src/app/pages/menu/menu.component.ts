import { Component } from '@angular/core';
import { MenuCardComponent } from '../../shared/components/menu-card/menu-card.component';
import { GameTitleComponent } from "../../shared/components/game-title/game-title.component";

@Component({
  selector: 'app-menu',
  imports: [MenuCardComponent, GameTitleComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {}
