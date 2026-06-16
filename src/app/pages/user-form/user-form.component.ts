import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service';

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
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  user: any = {
    name: '',
    email: '',
    phone: '',
    addresses: []
  };

  userId: number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId = id ? Number(id) : null;

    if (this.userId) {
      this.userService.findById(this.userId).subscribe({
        next: (data) => {
          console.log('USER EDIT:', data);

          this.user = {
            name: data.name ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
            addresses: data.addresses ?? []
          };
        },
        error: (err) => {
          console.error('Erro ao carregar usuário', err);
        }
      });
    }
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