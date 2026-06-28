import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../products/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('../categories/categories.module').then(m => m.CategoriesModule),
      },
      {
        path: 'import',
        loadChildren: () =>
          import('../import/import.module').then(m => m.ImportModule),
      },
    ],
  },
];

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class LayoutModule {}
