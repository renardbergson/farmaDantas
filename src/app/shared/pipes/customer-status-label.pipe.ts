import { Pipe, PipeTransform } from '@angular/core';
import { CustomerStatus } from '../models';

const labels: Record<CustomerStatus, string> = {
  [CustomerStatus.NEW]: 'Novo',
  [CustomerStatus.ACTIVE]: 'Ativo',
  [CustomerStatus.ABSENT]: 'Ausente',
  [CustomerStatus.INACTIVE]: 'Inativo',
};

@Pipe({
  name: 'customerStatusLabel', // nome do pipe para ser usado no template
  standalone: true,
})
export class CustomerStatusLabelPipe implements PipeTransform {
  transform(value: CustomerStatus): string {
    return labels[value] ?? value;
  }
}