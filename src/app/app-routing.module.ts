import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { salesComponent }      from './sales/sales.component';
import { saleDetailComponent }  from './sale-detail/sale-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'detail/:id', component: saleDetailComponent },
  { path: 'sales', component: salesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
