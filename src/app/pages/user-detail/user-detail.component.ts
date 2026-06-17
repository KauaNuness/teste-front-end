import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  user: any = null;

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.findById(id).subscribe({
      next: (data) => {
        this.user = { ...data };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar usuário', err);
      }
    });

  }

  back(): void {
    this.router.navigate(['/users']);
  }

}