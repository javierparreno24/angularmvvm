import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = '/phpulse/index.php';

  // Datos mock
  private clientesData = [
    { id: 1, nombre: 'Alvaro García', email: 'alvagar@example.com', telefono: '123456789' },
    { id: 2, nombre: 'Paula Gorgoño', email: 'paulagor@example.com', telefono: '987654321' },
    { id: 3, nombre: 'Pedro Perez', email: 'pperez@example.com', telefono: '555123456' }
  ];
      
  constructor(private http: HttpClient) { }

  // Método genérico para obtener datos (GET)
  getData(action: string): Observable<any> {
    if (action === 'clientes') {
      return of(this.clientesData);
    }
    return of([]);
  }

  // Método genérico para enviar datos (POST)
  postData(action: string, data: any): Observable<any> {
    const mock = { id: Date.now(), ...data };
    return of(mock);
  }

  // Método genérico para actualizar datos (PUT)
  putData(action: string, data: any): Observable<any> {
    const mock = { id: data.id, ...data };
    return of(mock);
  }

  // Método genérico para eliminar datos (DELETE)
  deleteData(action: string, id: number): Observable<any> {
    return of({ success: true });
  }
}

