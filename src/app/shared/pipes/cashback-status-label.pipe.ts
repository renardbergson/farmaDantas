import { Pipe, PipeTransform } from '@angular/core';
import { CashbackStatus } from '../models';

const labels: Record<CashbackStatus, string> = {
  [CashbackStatus.ACTIVE]: 'Ativo',
  [CashbackStatus.USED]: 'Utilizado',
  [CashbackStatus.EXPIRED]: 'Expirado',
};

@Pipe({
  name: 'cashbackStatusLabel',
  standalone: true,
})
export class CashbackStatusLabelPipe implements PipeTransform {
  transform(value: CashbackStatus): string {
    return labels[value] ?? value;
  }
}