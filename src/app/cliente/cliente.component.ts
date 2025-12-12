import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  clienteForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  editingId: number | null = null;  // ID del cliente siendo editado

  constructor(private clientesService: ClientesService, private fb: FormBuilder) {
    // Crear formulario reactivo en el constructor
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]]
    });
  }


ngOnInit() {
    this.getClientes(); // Cargar los datos cuando el componente se inicializa
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formData = this.clienteForm.value;

    // Determinar si es CREATE o UPDATE
    if (this.editingId !== null) {
      // Pedir confirmación antes de actualizar
      const confirmar = confirm('¿Seguro que quieres actualizar este cliente?');
      if (!confirmar) return;  // Si cancela, no hacer nada

      // UPDATE
      this.clientesService.putData('clientes', { id: this.editingId, ...formData }).subscribe({
        next: (res) => {
          // Actualizar el cliente en la lista local
          const index = this.clientes.findIndex(c => c.id === this.editingId);
          if (index !== -1) {
            this.clientes[index] = { id: this.editingId, ...formData };
          }
          this.successMessage = 'Cliente actualizado correctamente';
          this.errorMessage = null;
          this.clienteForm.reset({ nombre: '', email: '', telefono: '' });
          this.editingId = null;  // Salir del modo edición
        },
        error: (err) => {
          console.error('Error actualizando cliente', err);
          const index = this.clientes.findIndex(c => c.id === this.editingId);
          if (index !== -1) {
            this.clientes[index] = { id: this.editingId, ...formData };
          }
          this.errorMessage = 'Error al actualizar; cambios aplicados localmente.';
          this.successMessage = null;
          this.clienteForm.reset({ nombre: '', email: '', telefono: '' });
          this.editingId = null;
        }
      });
    } else {
      // CREATE: nueva entrada
      this.clientesService.postData('clientes', formData).subscribe({
        next: (res) => {
          const created = res && res.id ? res : { id: Date.now(), ...formData };
          this.clientes = [...this.clientes, created];
          this.successMessage = 'Cliente guardado correctamente';
          this.errorMessage = null;
          this.clienteForm.reset({ nombre: '', email: '', telefono: '' });
        },
        error: (err) => {
          console.error('Error enviando al endpoint, añadiendo localmente', err);
          this.clientes = [...this.clientes, { id: Date.now(), ...formData }];
          this.errorMessage = 'No fue posible guardar en el servidor; añadido localmente.';
          this.successMessage = null;
          this.clienteForm.reset({ nombre: '', email: '', telefono: '' });
        }
      });
    }
  }


 

getClientes(): void {
    this.clientesService.getData('clientes').subscribe({
      next: (data) => {
        // Aceptar tanto array directo como formato { value: [...] }
        const list = Array.isArray(data) ? data : (data && data.value) ? data.value : [];
        this.clientes = list;
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar clientes';
        console.error(err);
        this.loading = false;
      }
    });
}

deleteCliente(id: number): void {
  if (!confirm('¿Está seguro de que desea eliminar este cliente?')) return;
  // Llamar al backend para eliminar; si falla, eliminar localmente como fallback
  this.clientesService.deleteData('clientes', id).subscribe({
    next: (res) => {
      // Si el backend responde correctamente, refrescar desde API
      this.getClientes();
    },
    error: (err) => {
      console.error('Error eliminando cliente en API, eliminando localmente', err);
      this.clientes = this.clientes.filter(c => c.id !== id);
    }
  });
}

editCliente(id: number): void {
  // Cargar el cliente desde la tabla en el formulario
  const cliente = this.clientes.find(c => c.id === id);
  if (cliente) {
    console.log('Editando cliente:', cliente);
    console.log('ID:', cliente.id);
    console.log('Nombre:', cliente.nombre);
    console.log('Email:', cliente.email);
    console.log('Teléfono:', cliente.telefono);

    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono
    });
    this.editingId = id;  // Marcar como en modo edición
    this.successMessage = null;
    this.errorMessage = null;
    // Scroll o focus al formulario (opcional)
    const formElement = document.querySelector('.inline-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
}
