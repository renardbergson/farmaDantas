import { Pipe, PipeTransform } from '@angular/core';
import { PurchaseCategory } from '../models';

const labels: Record<PurchaseCategory, string> = {
  [PurchaseCategory.ANTIBIOTIC]: 'Antibiótico',
  [PurchaseCategory.CONTRACEPTIVE]: 'Anticoncepcional',
  [PurchaseCategory.CONTINUOUS]: 'Contínuo',
  [PurchaseCategory.CONTROLLED]: 'Controlado',
  [PurchaseCategory.KIDS]: 'Infantil',
  [PurchaseCategory.SUPPLEMENTS]: 'Suplementos',
  [PurchaseCategory.ELDERLY]: 'Idoso',
};

@Pipe({
  name: 'purchaseCategoryLabel', // nome do pipe para ser usado no template
  standalone: true,
})
export class PurchaseCategoryLabelPipe implements PipeTransform {
  transform(value: PurchaseCategory): string {
    return labels[value] ?? value;
  }
}