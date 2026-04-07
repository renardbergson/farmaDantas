import { Pipe, PipeTransform } from '@angular/core';
import { PurchaseMode } from '../models';

const labels: Record<PurchaseMode, string> = {
  [PurchaseMode.IN_STORE]: 'Presencial',
  [PurchaseMode.DELIVERY]: 'Delivery',
};

@Pipe({
  name: 'purchaseModeLabel',
  standalone: true,
})
export class PurchaseModeLabelPipe implements PipeTransform {
  transform(value: PurchaseMode): string {
    return labels[value] ?? value;
  }
}