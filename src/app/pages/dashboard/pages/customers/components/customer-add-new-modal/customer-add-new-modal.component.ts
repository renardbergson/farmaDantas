import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import {AddressService} from '../../../../../../shared/services/address.service';
import { CustomerService } from '../../../../../../shared/services/customer.service';

@Component({
  selector: 'app-customer-add-new-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, NgSelectModule],
  providers: [provideNgxMask()],
  templateUrl: './customer-add-new-modal.component.html',
  styleUrl: './customer-add-new-modal.component.css'
})
export class CustomerAddNewModal implements OnInit{
  @Output() customerAdded = new EventEmitter<void>();

  customerForm!: FormGroup;
  cities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCities();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: [''], // opcional
      phones: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      dateOfBirth: [''], // opcional
      city: ['', Validators.required],
    })
  }

  loadCities(): void {
    this.addressService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (err) => console.error(err)
    })
  }

  getPhones(): FormArray {
    return this.customerForm.get('phones') as FormArray;
  }

  addPhone(): void {
    const phonesArray = this.getPhones();
    if (phonesArray.length < 3) {
      // telefone opcional a partir do segundo
      phonesArray.push(this.fb.control(''));
    }
  }

  removePhone(index: number): void {
    const phonesArray = this.getPhones();
    if (phonesArray.length > 1) {
      phonesArray.removeAt(index);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
    // !! converte para booleano, é o mesmo que Boolean(...)
  }

  onSubmit() {
    if(this.customerForm.valid) {
      this.customerService.addCustomer(this.customerForm.value).subscribe({
        next: () => {
          this.customerAdded.emit();
          this.customerForm.reset();
          const closeBtn = document.querySelector<HTMLElement>('#newCustomerModal .btn-close')
          closeBtn?.click();
        },
        error: (err) => {
          console.error("Ocorreu um erro ao salvar o cliente:", err)
        }
      })
    } else {
      this.customerForm.markAllAsTouched();
      console.log("Formulário inválido");
    }
  }
}
