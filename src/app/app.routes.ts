import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-shell/admin-shell.component').then(
        (m) => m.AdminShellComponent,
      ),
    children: [
      {
        path: 'products/add',
        loadComponent: () =>
          import('./features/admin/products/pages/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
        data:{
          mode:'create'
        }
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/admin/products/pages/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
        data:{
          mode:'edit'
        }
      },
    ],
  },
];
