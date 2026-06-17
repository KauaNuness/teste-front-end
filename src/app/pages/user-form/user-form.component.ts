import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { CepService } from '../../services/cep.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
        error: (err) => {
          console.error(err);
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
    this.user.addresses.splice(index, 1);
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
          if (data.erro) return;

          address.street = data.logradouro;
          address.neighborhood = data.bairro;
          address.city = data.localidade;
          address.state = data.uf;
        },
        error: (err) => {
          console.error(err);
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

  save(): void {
    if (this.userId) {
      this.userService.update(this.userId, this.user).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => console.error(err)
      });
    } else {
      this.userService.create(this.user).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => console.error(err)
      });
    }
  }
}