import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerStatus } from '../../../../../../shared/models';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AddressService, City } from '../../../../../../shared/services/address.service';

@Component({
  selector: 'app-customer-details-modal',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './customer-details-modal.component.html',
  styleUrl: './customer-details-modal.component.css'
})
export class CustomerDetailsModal implements OnChanges, OnInit {
  @Input() customer?: Customer;
  cities: City[] = [];
  city?: City;

  constructor(private addressService: AddressService) { }

  ngOnInit(): void {
    this.addressService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => console.error('Ocorreu um erro ao listar as cidades:', err)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer']?.currentValue) {
      this.city = this.cities?.find(city => city.id === this.customer?.person?.cityId) || undefined;
    }
  }

  // Gera as iniciais do nome do cliente
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  protected readonly CustomerStatus = CustomerStatus;

  getStatusClass(status: CustomerStatus): string {
    switch (status) {
      case CustomerStatus.NEW: return 'badge-new';
      case CustomerStatus.ACTIVE: return 'badge-active';
      case CustomerStatus.ABSENT: return 'badge-absent';
      case CustomerStatus.INACTIVE: return 'badge-inactive';
      default: return 'badge-inactive';
    }
  }
}
