import { Component, EventEmitter, Input, OnChanges, SimpleChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  AddressService,
  State,
  City,
  CustomerService,
  createPerson,
  updatePerson,
} from '../../../../../../shared/services';
import { Customer } from '../../../../../../shared/models';

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
  states: State[] = [];
  cities: City[] = [];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadStates();
  }

  ngOnChanges(changes: SimpleChanges) {
    // 1. Verificamos se a propriedade 'customer' foi alterada
    if (changes['customer']) {
      // 2. Verificamos se o formulário já foi inicializado
      // ngOnChanges pode rodar antes do ngOnInit ***
      if (!this.customerForm) return;
      // 3. Verificamos o valor atual de 'customer'
      if (this.customer) {
        // MODO EDIÇÃO: o objeto existe
        this.fillForm(this.customer);
        const state = this.states.find(s => s.id === this.customer?.person.address.stateId);
        if (state) {
          this.loadCities(state)
        };
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
      email: [''],
      phone: ['', Validators.required],
      dateOfBirth: [''],
      zipCode: ['', Validators.required],
      street: ['', Validators.required],
      number: [''],
      complement: [''],
      neighborhood: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
    })
    this.customerForm.get('cityId')?.disable();
  }

  fillForm(customer: Customer): void {
    // Preenche o formulário com os dados vindo do objeto Customer
    this.customerForm.patchValue({
      name: customer.person.name,
      cpf: customer.person.cpf,
      email: customer.person.email,
      phone: customer.person.phone,
      dateOfBirth: customer.person.dateOfBirth,
      zipCode: customer.person.address.zipCode,
      street: customer.person.address.street,
      number: customer.person.address.number,
      complement: customer.person.address.complement,
      neighborhood: customer.person.address.neighborhood,
      stateId: customer.person.address.stateId,
      cityId: customer.person.address.cityId
    })
  }

  loadStates(): void {
    this.addressService.getStates().subscribe({
      next: (data) => {
        this.states = data;
        if (this.customer) {
          const state = this.states.find(s => s.id === this.customer?.person.address.stateId);
          if (state) this.loadCities(state);
          else {
            this.customerForm.get('cityId')?.disable();
          }
        }
      },
      error: (err) => console.error('Ocorreu um erro ao tentar listar os estados:', err)
    })
  }

  loadCities(state: State, selectedCityId?: number): void {
    this.customerForm.get('cityId')?.enable();
    this.addressService.getCities(state).subscribe({
      next: (data) => {
        this.cities = data;
        if (selectedCityId) {
          this.customerForm.patchValue({ cityId: selectedCityId });
        }
      },
      error: (err) => console.error('Ocorreu um erro ao tentar listar as cidades:', err)
    })
  }

  searchByCep(): void {
    const cep = this.customerForm.get('zipCode')?.value;
    if (!cep || cep.replace(/\D/g, '').length !== 8) return;

    this.addressService.getAddressByZipCode(cep).subscribe({
      next: (data) => {
        if (data.erro) {
          console.warn('CEP não encontrado');
          return;
        }

        const state = this.states.find(state => state.sigla === data.uf);
        if (state) {
          this.customerForm.patchValue({ stateId: state.id });
          const cityId = data.ibge ? parseInt(data.ibge, 10) : undefined; // 10 significa: tenha certeza de converter para número em base 10
          this.loadCities(state, cityId);
        }

        this.customerForm.patchValue({
          street: data.logradouro || '',
          neighborhood: data.bairro || ''
        })
      },
      error: (err) => console.error('Ocorreu um erro ao tentar buscar o endereço pelo CEP:', err)
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
    // !! converte para booleano, é o mesmo que Boolean(...)
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const raw = this.customerForm.getRawValue();
      const stateName = this.states.find(s => s.id === raw.stateId)?.nome;
      const cityName = this.cities.find(c => c.id === raw.cityId)?.nome;
      const customerData = {
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        phone: raw.phone,
        dateOfBirth: raw.dateOfBirth,
        address: {
          zipCode: raw.zipCode,
          stateId: raw.stateId,
          stateName,
          cityId: raw.cityId,
          cityName,
          street: raw.street,
          number: raw.number,
          complement: raw.complement,
          neighborhood: raw.neighborhood
        }
      }

      if (this.customer) {
        // MODO EDIÇÃO
        this.customerService.updateCustomer(this.customer.id, customerData as updatePerson).subscribe({
          next: () => this.handleSuccess(),
          error: (err) => console.error("Ocorreu um erro ao atualizar o cliente:", err)
        })
      } else {
        // MODO CRIAÇÃO
        this.customerService.addCustomer(customerData as createPerson).subscribe({
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
