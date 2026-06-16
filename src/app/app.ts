import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private readonly userService = inject(UserService);

  ngOnInit(): void {

    this.userService.findAll().subscribe({
      next: (users) => {
        console.log('Usuários encontrados:', users);
      },
      error: (error) => {
        console.error('Erro:', error);
      }
    });

  }
}