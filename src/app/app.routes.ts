import { Routes } from '@angular/router';
import { CartDetailComponent } from './features/cart-detail/cart-detail.component';
import { CitasComponent } from './features/citas/citas.component';
import { LoginComponent } from './features/auth/login/login.component';
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
    loadChildren: () =>
      import('features/products/product.routes').then(
        (m) => m.ROUTES_PRODUCTOS
      ),
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
