import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.css'
})
export class MenuCardComponent {
  @Input() title: string = '';
  @Input() routerLink: string = '';
  @Input() disabled: boolean = false;
}