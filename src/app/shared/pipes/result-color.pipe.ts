import { Pipe, PipeTransform } from '@angular/core';
import { Result } from '../models/game.model';

@Pipe({
  name: 'resultColor',
  standalone: true,
})
export class ResultColorPipe implements PipeTransform {
  transform(result: Result | undefined): string {
    if (result === 'WIN') return 'color: var(--text-green-color)';
    if (result === 'LOSS') return 'color: var(--text-red-color)';
    return 'color: var(--text-secondary-color)';
  }
}