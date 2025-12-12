import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes.service';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  title = 'angularmvvm';


  clientes: any[] = [];
  error: string | null = null;
  data: any;  // Variable para almacenar los datos
  loading: boolean = true;  // Indicador de carga


  constructor(private clientesService:ClientesService) {}


ngOnInit() {
    
    this.getClientes(); // Cargar los datos cuando el componente se inicializa
  }


 

getClientes(): void {
    this.clientesService.getData('clientes').subscribe({
      next: (data) => {
        this.clientes = data;  // Asignar los datos de productos
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
