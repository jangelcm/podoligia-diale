import { Routes } from '@angular/router';
import { ProductListComponent } from './products.component';
import { ProductNuevoEditarComponent } from './pages/product-nuevo-editar/product-nuevo-editar.component';
import { ProductosAdminComponent } from './pages/products-admin/productos-admin.component';

export const ROUTES_PRODUCTOS: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ProductListComponent,
    title: 'Listado de productos',
  },
  {
    path: 'admin',
    component: ProductosAdminComponent,
    title: 'Listado de productos para mantenimiento (ADMIN)',
  },
  {
    path: 'admin/editar/:id',
    component: ProductNuevoEditarComponent,
    title: 'Editar producto (ADMIN)',
  },
  {
    path: 'admin/nuevo',
    component: ProductNuevoEditarComponent,
    title: 'Nuevo producto (ADMIN)',
  },
];
