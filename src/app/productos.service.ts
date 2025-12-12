
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

private apiUrl = '/phpulse/index.php';

// Datos mock
private productosData = [
  { id: 1, nombre: 'Pantalón vaquero', precio: 39.99, categoria: 'Pantalones' },
  { id: 2, nombre: 'Gorra de béisbol', precio: 14.99, categoria: 'Accesorios' },
  { id: 3, nombre: 'Bolso de cuero', precio: 79.99, categoria: 'Accesorios' }
];
    
constructor(private http: HttpClient) { }

  // Método genérico para obtener datos (GET)
  getData(action: string): Observable<any> {
    if (action === 'productos') {
      return of(this.productosData);
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

