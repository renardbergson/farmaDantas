import { Pipe, PipeTransform } from '@angular/core';
import { PaymentMethod } from '../models';

const labels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Dinheiro',
  [PaymentMethod.PIX]: 'Pix',
  [PaymentMethod.DEBIT_CARD]: 'Cartão de débito',
  [PaymentMethod.CREDIT_CARD]: 'Cartão de crédito',
  [PaymentMethod.OTHER]: 'Outro',
};

@Pipe({
  name: 'paymentMethodsLabel',
  standalone: true,
})
export class PaymentMethodsLabelPipe implements PipeTransform {
  transform(value: PaymentMethod[]): string {
    return value.map((method) => labels[method] ?? method).join(', ');
  }
}