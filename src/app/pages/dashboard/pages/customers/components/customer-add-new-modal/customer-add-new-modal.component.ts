import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import {AddressService} from '../../../../../../shared/services/address.service';

@Component({
  selector: 'app-customer-add-new-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, NgSelectModule],
  providers: [provideNgxMask()],
  templateUrl: './customer-add-new-modal.component.html',
  styleUrl: './customer-add-new-modal.component.css',
})
export class CustomerAddNewModal implements OnInit{
  cities: string[] = [];
  phones: string[] = [''];

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities(): void {
    this.addressService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
        console.log(this.cities);
      },
      error: (err) => console.error(err)
    })
  }

  addPhone(): void {
    if (this.phones.length < 3) {
      this.phones.push('');
    }
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.splice(index, 1);
    }
  }
}
