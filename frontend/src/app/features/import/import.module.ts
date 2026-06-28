import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ImportHistoryComponent } from './import-history/import-history.component';

const routes: Routes = [{ path: 'history', component: ImportHistoryComponent }];

@NgModule({
  declarations: [ImportHistoryComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ImportModule {}
