import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;

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

  private setLoading(state: boolean): void {
    this.loading = state;
    this.cdr.detectChanges();
  }

  loadUsers(): void {
    this.setLoading(true);

    this.userService.findAll().subscribe({
      next: (data) => {
        this.dataSource.data = data ?? [];
        this.setLoading(false);
      },
      error: () => {
        this.toast.error('Erro ao carregar usuários');
        this.setLoading(false);
      }
    });
  }

  refresh(): void {
    this.setLoading(true);

    this.userService.findAll().subscribe({
      next: (data) => {
        this.dataSource.data = data ?? [];
        this.toast.success('Lista atualizada');
        this.setLoading(false);
      },
      error: () => {
        this.toast.error('Erro ao atualizar lista');
        this.setLoading(false);
      }
    });
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

      this.setLoading(true);

      this.userService.delete(id).subscribe({
        next: () => {
          this.toast.success('Usuário deletado com sucesso');
          this.loadUsers();
        },
        error: () => {
          this.toast.error('Erro ao deletar usuário');
          this.setLoading(false);
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