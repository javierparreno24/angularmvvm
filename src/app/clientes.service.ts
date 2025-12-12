import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private baseUrl = '/api';

  // Datos mock (fallback si la API no responde)
  private clientesData = [
    { id: 1, nombre: 'Alvaro García', email: 'alvagar@example.com', telefono: '123456789' },
    { id: 2, nombre: 'Paula Gorgoño', email: 'paulagor@example.com', telefono: '987654321' },
    { id: 3, nombre: 'Pedro Perez', email: 'pperez@example.com', telefono: '555123456' }
  ];
      
  constructor(private http: HttpClient) { }

  // GET /api/clientes
  getData(action: string): Observable<any> {
    if (action === 'clientes') {
      return this.http.get<any[]>(`${this.baseUrl}/clientes`).pipe(
        catchError(err => {
          console.error('Error fetching clientes from API, returning mock', err);
          return of(this.clientesData);
        })
      );
    }
    return of([]);
  }

  // POST /api/clientes
  postData(action: string, data: any): Observable<any> {
    if (action === 'clientes') {
      return this.http.post<any>(`${this.baseUrl}/clientes`, data).pipe(
        catchError(err => {
          console.error('Error posting cliente, returning mock-created', err);
          const mock = { id: Date.now(), ...data };
          return of(mock);
        })
      );
    }
    return of(null);
  }

  // PUT /api/clientes/:id
  putData(action: string, data: any): Observable<any> {
    if (action === 'clientes') {
      return this.http.put<any>(`${this.baseUrl}/clientes/${data.id}`, data).pipe(
        catchError(err => {
          console.error('Error updating cliente, returning patched mock', err);
          const mock = { id: data.id, ...data };
          return of(mock);
        })
      );
    }
    return of(null);
  }

  // DELETE /api/clientes/:id
  deleteData(action: string, id: number): Observable<any> {
    if (action === 'clientes') {
      return this.http.delete<any>(`${this.baseUrl}/clientes/${id}`).pipe(
        catchError(err => {
          console.error('Error deleting cliente, returning success mock', err);
          return of({ success: true });
        })
      );
    }
    return of({ success: false });
  }
}

