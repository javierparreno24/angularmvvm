
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl = '/api';

  // Datos mock (fallback si la API no responde)
  private productosData = [
    { id: 1, nombre: 'Pantalón vaquero', precio: 39.99, categoria: 'Pantalones' },
    { id: 2, nombre: 'Gorra de béisbol', precio: 14.99, categoria: 'Accesorios' },
    { id: 3, nombre: 'Bolso de cuero', precio: 79.99, categoria: 'Accesorios' }
  ];
      
  constructor(private http: HttpClient) { }

  // GET /api/productos
  getData(action: string): Observable<any> {
    if (action === 'productos') {
      return this.http.get<any[]>(`${this.baseUrl}/productos`).pipe(
        catchError(err => {
          console.error('Error fetching productos from API, returning mock', err);
          return of(this.productosData);
        })
      );
    }
    return of([]);
  }

  // POST /api/productos
  postData(action: string, data: any): Observable<any> {
    if (action === 'productos') {
      return this.http.post<any>(`${this.baseUrl}/productos`, data).pipe(
        catchError(err => {
          console.error('Error posting producto, returning mock-created', err);
          const mock = { id: Date.now(), ...data };
          return of(mock);
        })
      );
    }
    return of(null);
  }

  // PUT /api/productos/:id
  putData(action: string, data: any): Observable<any> {
    if (action === 'productos') {
      return this.http.put<any>(`${this.baseUrl}/productos/${data.id}`, data).pipe(
        catchError(err => {
          console.error('Error updating producto, returning patched mock', err);
          const mock = { id: data.id, ...data };
          return of(mock);
        })
      );
    }
    return of(null);
  }

  // DELETE /api/productos/:id
  deleteData(action: string, id: number): Observable<any> {
    if (action === 'productos') {
      return this.http.delete<any>(`${this.baseUrl}/productos/${id}`).pipe(
        catchError(err => {
          console.error('Error deleting producto, returning success mock', err);
          return of({ success: true });
        })
      );
    }
    return of({ success: false });
  }

  // GET /api/categorias
  getCategorias(): Observable<any> {
    const mockCats = [
      { id: 1, nombre: 'Pantalones' },
      { id: 2, nombre: 'Accesorios' }
    ];
    return this.http.get<any[]>(`${this.baseUrl}/categorias`).pipe(
      catchError(err => {
        console.error('Error fetching categorias from API, returning mock', err);
        return of(mockCats);
      })
    );
  }
}

