import { Component, EventEmitter, Input, OnChanges, SimpleChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddressService } from '../../../../../../shared/services/address.service';
import { CustomerService } from '../../../../../../shared/services/customer.service';
import { Customer } from '../../../../../../shared/models/customer.model';

@Component({
  selector: 'app-customer-add-new-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, NgSelectModule],
  providers: [provideNgxMask()],
  templateUrl: './customer-add-new-modal.component.html',
  styleUrl: './customer-add-new-modal.component.css'
})
export class CustomerAddNewModal implements OnInit, OnChanges {
  @Output() customerAdded = new EventEmitter<void>();
  @Input() customer?: Customer;

  customerForm!: FormGroup;
  cities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCities();
  }

  ngOnChanges(changes: SimpleChanges) {
    // 1. Verificamos se a propriedade 'customer' foi alterada
    if (changes['customer']) {
      // 2. Verificamos se o formulário já foi inicializado
      // ngOnChanges pode rodar antes do ngOnInit ***
      if (!this.customerForm) return;

      // 3. Verificamos se o valor atual de 'customer'
      // para decidir se estamos em modo de edição ou criação
      if (this.customer) {
        // MODO EDIÇÃO: o objeto existe
        this.fillForm(this.customer);
      } else {
        // MODO CRIAÇÃO: o objeto é undefined
        this.customerForm.reset();
      }
    }
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: [''], // opcional
      phone: ['', Validators.required],
      dateOfBirth: [''], // opcional
      city: ['', Validators.required],
    })
  }

  fillForm(customer: Customer): void {
    // Preenche o restante do formulário com os dados do cliente
    // O patchValue ignora campos que não exisem no formulário,
    // como id, status, etc
    this.customerForm.patchValue({
      name: customer.name,
      cpf: customer.cpf,
      email: customer.email,
      phone: customer.phone,
      dateOfBirth: customer.dateOfBirth,
      city: customer.city
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
    // !! converte para booleano, é o mesmo que Boolean(...)
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;

      if (this.customer) {
        // MODO EDIÇÃO
        this.customerService.updateCustomer(this.customer.id, customerData).subscribe({
          next: () => this.handleSuccess(),
          error: (err) => console.error("Ocorreu um erro ao atualizar o cliente:", err)
        })
      } else {
        // MODO CRIAÇÃO
        this.customerService.addCustomer(customerData).subscribe({
          next: () => this.handleSuccess(),
          error: (err) => console.error("Ocorreu um erro ao salvar o cliente:", err)
        })
      }
    } else {
      this.customerForm.markAllAsTouched();
      console.error("Formulário inválido");
    }
  }

  private handleSuccess(): void {
    this.customerAdded.emit();
    this.customerForm.reset();
    const closeBtn = document.querySelector<HTMLElement>('#newCustomerModal .btn-close');
    closeBtn?.click();
  }
}
