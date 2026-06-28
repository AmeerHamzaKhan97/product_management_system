import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

const routes: Routes = [{ path: '', component: CategoryListComponent }];

@NgModule({
  declarations: [CategoryListComponent, CategoryDialogComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class CategoriesModule {}
