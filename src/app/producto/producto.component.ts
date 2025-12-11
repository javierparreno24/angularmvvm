import { Component } from '@angular/core';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-root',
  templateUrl: '../app.component.html',
  styleUrls: ['../app.component.scss']
})
export class ProductoComponent {
  title = 'angularmvvm';

  productos: any[] = [];
  error: string | null = null;
  data: any;  // Variable para almacenar los datos
  loading: boolean = true;  // Indicador de carga


  constructor(private productosService: ProductosService) {}


ngOnInit() {
    this.getProductos(); 
    // Cargar los datos cuando el componente se inicializa
  }


  getProductos(): void {
    this.productosService.getData('productos').subscribe({
      next: (data) => {
        this.productos = data;  // Asignar los datos de productos
        this.data = data;  // Asignar la respuesta a la variable 'data'
        this.loading = false;   // Detener el indicador de carga
      },
      error: (err) => {
        this.error = 'Error al cargar productos';  // Manejar errores
        console.error(err);
      }
    });
}


}














