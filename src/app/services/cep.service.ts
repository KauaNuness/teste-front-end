import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly http = inject(HttpClient);

  search(cep: string): Observable<any> {
    const cleanCep = cep.replace(/\D/g, '');
    return this.http.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
  }
}