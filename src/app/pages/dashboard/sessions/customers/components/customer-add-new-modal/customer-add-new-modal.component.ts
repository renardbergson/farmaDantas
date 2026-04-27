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
  FeedbackService,
} from '../../../../../../shared/services';
import { CreateCustomerRequest, Customer, CustomerDetailsResponse } from '../../../../../../shared/models';

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
    private feedback: FeedbackService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadStates();
    this.customerForm.get('zipCode')?.valueChanges.subscribe((value: string | null) => {
      const digits = (value ?? '').replace(/\D/g, '');
      if (!digits) {
        this.clearStateAndCityFromCep();
      }
    })
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
      error: (err) => {
        this.feedback.error('Erro ao carregar cliente para edição')
        console.error('Erro ao carregar cliente para edição:', err);
      }
    });
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', Validators.required],
      email: [''],
      phone: ['', Validators.required],
      dateOfBirth: [''],

      zipCode: [''],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      stateId: [''],
      cityId: [''],
    });
    this.customerForm.get('cityId')?.disable();
  }

  onStateChange(stateValue: State | undefined): void {
    if (!stateValue) {
      this.cities = [];
      this.customerForm.patchValue({ cityId: null });
      this.customerForm.get('cityId')?.disable();
      return;
    }

    const state = this.states.find((st) => st.id === stateValue.id);
    if (!state) return;

    this.customerForm.get('cityId')?.enable();
    this.customerForm.patchValue({ cityId: null });
    this.loadCities(state);
  }

  loadStates(): void {
    this.addressService.getStates().subscribe({
      next: (states) => {
        this.states = states;
        if (this.dataToEdit) {
          this.loadCitiesFromResponse(this.dataToEdit);
        }
      },
      error: (err) => {
        this.feedback.error('Erro ao tentar listar estados')
        console.error('Erro ao tentar listar estados:', err);
      }
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
      error: (err) => {
        this.feedback.error('Erro ao tentar listar cidades')
        console.error('Erro ao tentar listar cidades:', err);
      }
    });
  }

  searchByCep(): void { // chamado a partir do template
    const cep = this.customerForm.get('zipCode')?.value;
    if (!cep || cep.replace(/\D/g, '').length !== 8) return;

    this.addressService.getAddressByZipCode(cep).subscribe({
      next: (data) => {
        if (data.erro) { // no IBGE, erro é true quando o CEP não é encontrado
          this.feedback.warning('CEP não encontrado');
          console.warn('CEP não encontrado:', { cep });
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
      error: (err) => {
        this.feedback.error('Erro ao buscar endereço por CEP')
        console.error('Erro ao buscar endereço por CEP:', err);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit(): void {
    if (!this.customerForm.valid) {
      this.customerForm.markAllAsTouched();
      this.feedback.error('Formulário inválido');
      console.warn('Formulário inválido');
      return;
    }

    const raw = this.customerForm.getRawValue();

    const hasAddress =
      !!raw.zipCode ||
      !!raw.street ||
      !!raw.number ||
      !!raw.complement ||
      !!raw.neighborhood ||
      !!raw.stateId ||
      !!raw.cityId;

    const customerData = {
      name: raw.name,
      cpf: raw.cpf,
      email: raw.email,
      phone: raw.phone,
      dateOfBirth: raw.dateOfBirth,
      address: hasAddress
        ? {
          zipCode: raw.zipCode,
          street: raw.street,
          number: raw.number,
          complement: raw.complement,
          neighborhood: raw.neighborhood,
          cityId: raw.cityId,
          stateId: raw.stateId,
        }
        : null
    };

    const request$ = this.customer
      ? this.customerService.updateCustomer(this.customer.id, customerData)
      : this.customerService.addCustomer(customerData);

    request$.subscribe({
      next: () =>
        this.handleSuccess(this.customer ? 'Cliente atualizado com sucesso' : 'Cliente salvo com sucesso'),
      error: (err) => {
        this.feedback.apiError(
          err,
          this.customer ? 'Erro ao tentar atualizar o cliente' : 'Erro ao tentar salvar o cliente',
          { apiStatuses: [409] }
        );
        console.error(this.customer ? 'Erro ao tentar atualizar o cliente:' : 'Erro ao tentar salvar o cliente:', err);
      },
    });
  }

  private handleSuccess(feedbackMessage: string): void {
    this.dataToEdit = null;
    this.customerAdded.emit();
    this.customerForm.reset();
    const closeBtn = document.querySelector<HTMLElement>('#newCustomerModal .btn-close');
    closeBtn?.click();
    this.feedback.success(feedbackMessage);
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
      zipCode: details?.address?.zipCode ?? '',
      street: details?.address?.street ?? '',
      number: details?.address?.number ?? '',
      complement: details?.address?.complement ?? '',
      neighborhood: details?.address?.neighborhood ?? '',
      stateId: details?.address?.stateId ?? '',
      cityId: details?.address?.cityId ?? '',
    });
  }

  private loadCitiesFromResponse(details: CustomerDetailsResponse): void {
    const state = this.states.find((state) => state.id === details?.address?.stateId);
    if (state) {
      this.loadCities(state, details?.address?.cityId ?? undefined);
    } else {
      this.customerForm.get('cityId')?.disable();
    }
  }

  private clearStateAndCityFromCep(): void {
    this.cities = [];
    this.customerForm.patchValue({
      stateId: null,
      cityId: null,
      street: '',
      neighborhood: '',
      complement: '',
      number: ''
    });
    this.customerForm.get('cityId')?.disable();
  }
}