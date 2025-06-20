import { Routes } from '@angular/router';
import { ProductListComponent } from './features/product-list/product-list.component';
import { CartDetailComponent } from './features/cart-detail/cart-detail.component';
import { CitasComponent } from './features/citas/citas.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ProductosAdminComponent } from './features/productos-admin/productos-admin.component';
import { ProductNuevoEditarComponent } from 'features/productos-admin/product-nuevo-editar/product-nuevo-editar.component';
import { HomeComponent } from 'features/home/home.component';
import { VentasAdminComponent } from 'features/ventas-admin/ventas-admin.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'productos',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ProductListComponent,
        title: 'Product List',
      },
      {
        path: 'admin',
        component: ProductosAdminComponent,
        title: 'Admin Productos',
      },
      {
        path: 'nuevo',
        component: ProductNuevoEditarComponent,
        title: 'Nuevo Producto',
      },
      {
        path: 'editar/:id',
        component: ProductNuevoEditarComponent,
        title: 'Editar Producto',
      },
    ],
  },
  {
    path: 'carrito',
    component: CartDetailComponent,
    title: 'Cart Detail',
  },
  {
    path: 'ventas-admin',
    component: VentasAdminComponent,
    title: 'Ventas',
  },
  {
    path: 'citas',
    component: CitasComponent,
    title: 'Citas',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar sesión',
  },
];
