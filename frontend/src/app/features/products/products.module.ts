import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { UploadDialogComponent } from '../import/upload-dialog/upload-dialog.component';
import { ImportBannerComponent } from './import-banner/import-banner.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [{ path: '', component: ProductListComponent }];

@NgModule({
  declarations: [ProductListComponent, ProductDialogComponent, ImportBannerComponent, UploadDialogComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ProductsModule {}
