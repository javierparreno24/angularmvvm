
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

private apiUrl = 'http://localhost/phpulse/index.php';  // URL base de la API

// Datos 
private productosData = [
  { id: 1, nombre: 'Pantalón vaquero', precio: 39.99, categoria: 'Pantalones' },
  { id: 2, nombre: 'Gorra de béisbol', precio: 14.99, categoria: 'Zapatillas' },
  { id: 3, nombre: 'Bolso de cuero', precio: 79.99, categoria: 'Sin categoría' }
];
    
constructor(private http: HttpClient) { }

      // Método genérico para obtener datos (GET)
  getData(action: string): Observable<any> {
    if (action === 'productos') {
      return of(this.productosData);
    }
    const url = `http://localhost:3000/${action}`;  // URL dinámica basada en la acción
    return this.http.get<any>(url);  // Hacer la solicitud GET
  }

  // Método genérico para enviar datos (POST)
  postData(action: string, data: any): Observable<any> {
    const url = `${this.apiUrl}?action=${action}`;  // URL dinámica basada en la acción
    return this.http.post<any>(url, data);  // Hacer la solicitud POST
  }

  // Método genérico para actualizar datos (PUT)
  putData(action: string, data: any): Observable<any> {
    const url = `${this.apiUrl}?action=${action}`;  // URL dinámica basada en la acción
    return this.http.put<any>(url, data);  // Hacer la solicitud PUT
  }

  // Método genérico para eliminar datos (DELETE)
  deleteData(action: string, id: number): Observable<any> {
    const url = `${this.apiUrl}?action=${action}&id=${id}`;  // URL dinámica con el id
    return this.http.delete<any>(url);  // Hacer la solicitud DELETE
  }
    }

