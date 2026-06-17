import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'actions'
  ];

  dataSource = new MatTableDataSource<User>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.findAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => {
        this.toast.error('Erro ao carregar usuários');
      }
    });
  }

  refresh(): void {
    this.loadUsers();
    this.toast.success('Lista atualizada');
  }

  deleteUser(id: number): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir usuário',
        message: 'Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      this.userService.delete(id).subscribe({
        next: () => {
          this.toast.success('Usuário deletado com sucesso');
          this.loadUsers();
        },
        error: () => {
          this.toast.error('Erro ao deletar usuário');
        }
      });

    });
  }

  goToCreate(): void {
    this.router.navigate(['/users/new']);
  }

  viewUser(id: number): void {
    this.router.navigate(['/users', id]);
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }
}