import { Component, input } from '@angular/core';

@Component({
  selector: 'app-success-message',
  imports: [],
  templateUrl: './success-message.component.html',
  styleUrl: './success-message.component.css',
})
export class SuccessMessageComponent {
  message = input<string | null>();
}
