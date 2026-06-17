import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(`✔ ${message}`, 'Fechar', {
      duration: 3000,
      panelClass: ['toast-success']
    });
  }

  error(message: string): void {
    this.snackBar.open(`❌ ${message}`, 'Fechar', {
      duration: 5000,
      panelClass: ['toast-error']
    });
  }

  warning(message: string): void {
    this.snackBar.open(`⚠ ${message}`, 'Fechar', {
      duration: 4000,
      panelClass: ['toast-warning']
    });
  }

  info(message: string): void {
    this.snackBar.open(`ℹ ${message}`, 'Fechar', {
      duration: 3000,
      panelClass: ['toast-info']
    });
  }
}