import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { CepService } from '../../services/cep.service';
import { ToastService } from '../../services/toast.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly cepService = inject(CepService);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  userId: number | null = null;

  user: any = {
    name: '',
    email: '',
    phone: '',
    addresses: []
  };

  private cepTimeout: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId = id ? Number(id) : null;

    if (this.userId) {
      this.userService.findById(this.userId).subscribe({
        next: (data) => {
          this.user = {
            ...data,
            addresses: data.addresses ?? []
          };
        },
        error: () => {
          this.toast.error('Erro ao carregar usuário');
        }
      });
    }
  }

  addAddress(): void {
    this.user.addresses.push({
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: ''
    });
  }

  removeAddress(index: number): void {
    const confirm = window.confirm('Tem certeza que deseja remover este endereço?');

    if (!confirm) return;

    this.user.addresses.splice(index, 1);
    this.toast.success('Endereço removido');
  }

  formatCep(value: string): string {
    return (value || '')
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  }

  onCepChange(address: any): void {
    clearTimeout(this.cepTimeout);

    this.cepTimeout = setTimeout(() => {
      address.cep = this.formatCep(address.cep);

      const cep = address.cep.replace(/\D/g, '');

      if (cep.length !== 8) return;

      this.cepService.search(cep).subscribe({
        next: (data) => {
          if (data.erro) {
            this.toast.error('CEP inválido');
            return;
          }

          address.street = data.logradouro;
          address.neighborhood = data.bairro;
          address.city = data.localidade;
          address.state = data.uf;

          this.toast.success('Endereço preenchido automaticamente');
        },
        error: () => {
          this.toast.error('Erro ao buscar CEP');
        }
      });
    }, 400);
  }

  formatPhone(value: string): string {
    const digits = (value || '').replace(/\D/g, '').substring(0, 11);

    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    }

    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  }

  onPhoneChange(): void {
    this.user.phone = this.formatPhone(this.user.phone);
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePhone(phone: string): boolean {
    const digits = (phone || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  save(): void {

    const errors: string[] = [];

    if (!this.user.name?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!this.user.email?.trim()) {
      errors.push('Email é obrigatório');
    } else if (!this.validateEmail(this.user.email)) {
      errors.push('Email inválido');
    }

    if (!this.validatePhone(this.user.phone)) {
      errors.push('Telefone inválido (DDD + número)');
    }

    if (!this.user.addresses || this.user.addresses.length === 0) {
      errors.push('Adicione pelo menos um endereço');
    }

    this.user.addresses.forEach((addr: any, index: number) => {

      if (!addr.cep) {
        errors.push(`Endereço ${index + 1}: CEP é obrigatório`);
      }

      if (!addr.street?.trim()) {
        errors.push(`Endereço ${index + 1}: Rua é obrigatória`);
      }

      if (!addr.number?.trim()) {
        errors.push(`Endereço ${index + 1}: Número é obrigatório`);
      }

      if (!addr.city?.trim()) {
        errors.push(`Endereço ${index + 1}: Cidade é obrigatória`);
      }

      if (!addr.state?.trim()) {
        errors.push(`Endereço ${index + 1}: Estado é obrigatório`);
      }
    });

    if (errors.length > 0) {
      errors.forEach(err => this.toast.error(err));
      return;
    }

    if (this.userId) {
      this.userService.update(this.userId, this.user).subscribe({
        next: () => {
          this.toast.success('Usuário atualizado com sucesso');
          this.router.navigate(['/users']);
        },
        error: () => {
          this.toast.error('Erro ao atualizar usuário');
        }
      });
    } else {
      this.userService.create(this.user).subscribe({
        next: () => {
          this.toast.success('Usuário criado com sucesso');
          this.router.navigate(['/users']);
        },
        error: () => {
          this.toast.error('Erro ao criar usuário');
        }
      });
    }
  }
}