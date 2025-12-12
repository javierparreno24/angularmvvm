import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../productos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  title = 'angularmvvm';

  productos: any[] = [];
  categories: string[] = [];
  error: string | null = null;
  data: any;  // Variable para almacenar los datos
  loading: boolean = true;  // Indicador de carga
  productForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  editingId: number | null = null;  // ID del producto siendo editado


  constructor(private productosService: ProductosService, private fb: FormBuilder) {
    // Crear formulario reactivo en el constructor
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]]
    });
  }


  ngOnInit() {
      this.getProductos(); 
      // Cargar los datos cuando el componente se inicializa
    }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = this.productForm.value;

    // Determinar si es CREATE o UPDATE
    if (this.editingId !== null) {
      // Pedir confirmación antes de actualizar
      const confirmar = confirm('¿Estás seguro que quieres actualizar este producto?');
      if (!confirmar) return;  // Si cancela, no hacer nada

      // UPDATE: enviar con el ID del producto siendo editado
      this.productosService.putData('productos', { id: this.editingId, ...formData }).subscribe({
        next: (res) => {
          // Actualizar el producto en la lista local
          const index = this.productos.findIndex(p => p.id === this.editingId);
          if (index !== -1) {
            this.productos[index] = { id: this.editingId, ...formData };
          }
          // Actualizar lista de categorías si es nueva
          const cat = formData.categoria;
          if (cat && !this.categories.includes(cat)) this.categories.push(cat);
          this.successMessage = 'Producto actualizado correctamente';
          this.errorMessage = null;
          this.productForm.reset({ nombre: '', precio: 0, categoria: '' });
          this.editingId = null;  // Salir del modo edición
        },
        error: (err) => {
          console.error('Error actualizando producto', err);
          const index = this.productos.findIndex(p => p.id === this.editingId);
          if (index !== -1) {
            this.productos[index] = { id: this.editingId, ...formData };
          }
          const cat = formData.categoria;
          if (cat && !this.categories.includes(cat)) this.categories.push(cat);
          this.errorMessage = 'Error al actualizar; cambios aplicados localmente.';
          this.successMessage = null;
          this.productForm.reset({ nombre: '', precio: 0, categoria: '' });
          this.editingId = null;
        }
      });
    } else {
      // CREATE: nueva entrada
      this.productosService.postData('productos', formData).subscribe({
        next: (res) => {
          const created = res && res.id ? res : { id: Date.now(), ...formData };
          this.productos = [...this.productos, created];
          // Añadir categoría si aparece una nueva
          const cat = created.categoria;
          if (cat && !this.categories.includes(cat)) this.categories.push(cat);
          this.successMessage = 'Producto guardado correctamente';
          this.errorMessage = null;
          this.productForm.reset({ nombre: '', precio: 0, categoria: '' });
        },
        error: (err) => {
          console.error('Error enviando al endpoint, añadiendo localmente', err);
          this.productos = [...this.productos, { id: Date.now(), ...formData }];
          const cat = formData.categoria;
          if (cat && !this.categories.includes(cat)) this.categories.push(cat);
          this.errorMessage = 'No fue posible guardar en el servidor; añadido localmente.';
          this.successMessage = null;
          this.productForm.reset({ nombre: '', precio: 0, categoria: '' });
        }
      });
    }
  }

  deleteProduct(id: number): void {
    const ok = confirm('¿Deseas eliminar este producto?');
    if (!ok) return;
    this.productos = this.productos.filter(p => p.id !== id);
  }

  editProduct(id: number): void {
    // Cargar el producto desde la tabla en el formulario
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
      console.log('Editando producto:', producto);
      console.log('ID:', producto.id);
      console.log('Nombre:', producto.nombre);
      console.log('Precio:', producto.precio);
      console.log('Categoría:', producto.categoria);
      
      this.productForm.patchValue({
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria
      });
      this.editingId = id;  // Marcar como en modo edición
      // Asegurar que la categoría del producto esté en la lista de categorías
      if (producto.categoria && !this.categories.includes(producto.categoria)) {
        this.categories.push(producto.categoria);
      }
      this.successMessage = null;
      this.errorMessage = null;
      // Scroll o focus al formulario (opcional)
      const formElement = document.querySelector('.inline-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }


    getProductos(): void {
      this.productosService.getData('productos').subscribe({
        next: (data) => {
          this.productos = data;  // Asignar los datos de productos
          this.data = data;  // Asignar la respuesta a la variable 'data'
          // Derivar lista única de categorías desde los productos
          this.categories = Array.from(new Set(this.productos.map((p: any) => p.categoria).filter(Boolean)));
          this.loading = false;   // Detener el indicador de carga
        },
        error: (err) => {
          this.error = 'Error al cargar productos';  // Manejar errores
          console.error(err);
        }
      });
    }


}















