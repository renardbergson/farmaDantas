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
import { Customer, CustomerDetailsResponse } from '../../../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-add-new-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, NgSelectModule],
  providers: [provideNgxMask()],
  templateUrl: './customer-add-new-modal.component.html',
  styleUrl: './customer-add-new-modal.component.css',
})
export class CustomerAddNewModal implements OnInit, OnChanges {
  @Output() customerAdded = new EventEmitter<void>();
  @Input() customer?: Customer;

  customerForm!: FormGroup;
  states: State[] = [];
  cities: City[] = [];

  private dataToEdit: CustomerDetailsResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private customerService: CustomerService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['customer']) return;
    if (!this.customerForm) return;

    if (!this.customer) {
      this.dataToEdit = null;
      this.customerForm.reset();
      return;
    }

    this.customerService.getCustomerDetails(this.customer.id).subscribe({
      next: (dataToEdit) => {
        this.dataToEdit = dataToEdit;
        this.fillFormFromDetails(dataToEdit);
        this.loadCitiesFromResponse(dataToEdit);
      },
      error: () => this.toast.error('Erro ao carregar cliente para edição')
    });
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
    });
    this.customerForm.get('cityId')?.disable();
  }

  private fillFormFromDetails(details: CustomerDetailsResponse): void {
    this.customerForm.patchValue({
      name: details.name,
      cpf: details.cpf,
      email: details.email ?? '',
      phone: details.phone,
      dateOfBirth: details.dateOfBirth
        ? details.dateOfBirth
        : null,
      zipCode: details.address.zipCode,
      street: details.address.street,
      number: details.address.number ?? '',
      complement: details.address.complement ?? '',
      neighborhood: details.address.neighborhood,
      stateId: details.address.stateId,
      cityId: details.address.cityId,
    });
  }

  private loadCitiesFromResponse(details: CustomerDetailsResponse): void {
    const state = this.states.find((state) => state.id === details.address.stateId);
    if (state) {
      this.loadCities(state, details.address.cityId ?? undefined);
    } else {
      this.customerForm.get('cityId')?.disable();
    }
  }

  loadStates(): void {
    this.addressService.getStates().subscribe({
      next: (states) => {
        this.states = states;
        if (this.dataToEdit) {
          this.loadCitiesFromResponse(this.dataToEdit);
        }
      },
      error: () => this.toast.error('Erro ao tentar listar os estados')
    });
  }

  loadCities(state: State, selectedCityId?: number): void {
    this.customerForm.get('cityId')?.enable();
    this.addressService.getCities(state).subscribe({
      next: (data) => {
        this.cities = data;
        if (selectedCityId != null) {
          this.customerForm.patchValue({ cityId: selectedCityId });
        }
      },
      error: () => this.toast.error('Erro ao tentar listar as cidades')
    });
  }

  searchByCep(): void { // chamado a partir do template
    const cep = this.customerForm.get('zipCode')?.value;
    if (!cep || cep.replace(/\D/g, '').length !== 8) return;

    this.addressService.getAddressByZipCode(cep).subscribe({
      next: (data) => {
        if (data.erro) { // no IBGE, erro é true quando o CEP não é encontrado
          this.toast.warning('CEP não encontrado');
          return;
        }

        const state = this.states.find((state) => state.sigla === data.uf);
        if (state) {
          this.customerForm.patchValue({ stateId: state.id });
          const cityId = data.ibge ? parseInt(data.ibge, 10) : undefined;
          this.loadCities(state, cityId);
        }

        this.customerForm.patchValue({
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
        });
      },
      error: () => this.toast.error('Erro ao buscar o endereço pelo CEP')
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const raw = this.customerForm.getRawValue();

      const customerData = {
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        phone: raw.phone,
        dateOfBirth: raw.dateOfBirth,
        address: {
          zipCode: raw.zipCode,
          street: raw.street,
          number: raw.number,
          complement: raw.complement,
          neighborhood: raw.neighborhood,
          cityId: raw.cityId,
          stateId: raw.stateId,
        },
      };

      if (this.customer) {
        this.customerService.updateCustomer(this.customer.id, customerData as updatePerson).subscribe({
          next: () => this.handleSuccess('Cliente atualizado com sucesso'),
          error: () => this.toast.error('Erro ao tentar atualizar o cliente')
        });
      } else {
        this.customerService.addCustomer(customerData as createPerson).subscribe({
          next: () => this.handleSuccess('Cliente salvo com sucesso'),
          error: (err) => {
            if (err instanceof HttpErrorResponse &&
              err.status === 409 &&
              typeof err.error?.message === 'string'
            ) {
              this.toast.error(err.error.message); // conflito de CPF
            } else {
              this.toast.error('Erro ao tentar salvar o cliente');
            }
          }
        });
      }
    } else {
      this.customerForm.markAllAsTouched();
      this.toast.error('Formulário inválido');
    }
  }

  private handleSuccess(toastMessage: string): void {
    this.dataToEdit = null;
    this.customerAdded.emit();
    this.customerForm.reset();
    const closeBtn = document.querySelector<HTMLElement>('#newCustomerModal .btn-close');
    closeBtn?.click();
    this.toast.success(toastMessage);
  }
}